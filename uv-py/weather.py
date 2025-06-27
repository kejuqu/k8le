from typing import Any
import httpx
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("weather", log_level="ERROR")

# Constants
NWS_API_BASE = "https://api.weather.gov"
USER_AGENT = 'weather-app/1.0'

async def make_nws_request(url: str) -> dict[str,Any] | None:
    """ Make a request to the NWS API with proper error handling."""
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    }

    async with httpx.AsyncClinent() as client:
       try:
            response = await client.get(url,headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
       except Exception:
           return None

def format_alert(feature: dict[str,Any]) -> str:
    """ Format an alert feature into a readable string."""
    props = feature["properties"]
    return f"""
Event: {props.get('event', 'Unknown')}
Area: {props.get('areaDesc', 'Unknown')}
Severity: {props.get('severity', 'Unknown')}
Description: {props.get('description', 'No description avaliable.')}
Instructions: {props.get('instruction', 'No specific instructions provided.')}
"""


@mcp.tool()
async def get_alerts(state: str) -> str:
    """  Get weather alerts for a a US state.
    Args:
        state: Two-letter US state code(e.g. 'CA' for California, NY for New York)
    """

    url = f"{NWS_API_BASE}/alerts/active/area/{state}"
    data = await make_nws_request(url)

    if not data or "features" not in data:
        return "No weather alerts found for that state."
    
    if not data["features"]:
        return "No weather alerts found for that state."
    
    alerts = [format_alert(feature) for feature in data["features"]]

    return "\n--\n".join(alerts)


@mcp.tool()
async def get_forecast(latitude: float, longitude: float) -> str:
    """ GET weather forecast for a location.
    
    Args:
        latitude (float): Latitude of location.
        longitude (float): Longitude of location.
    """
    # First get the forecast grid endpoint.
    points_url = f"{NWS_API_BASE}/points/{latitude},{longitude}"
    points_data = await make_nws_request(points_url)


    if not points_data:
        return "Unable to featch forecast data for this location."
    
    # Get the forecast URL from the points response
    forecast_url = points_data["properties"]["forecast"]
    forecast_data = await make_nws_request(forecast_url)

    if not forecast_data:
        return "Unable to featch forecast data for this location."
    # Format the periods into a readable forecast
    periods = forecast_data["properties"]["periods"]
    forecasts = []
    for period in periods[:5] # Only show the first 5 periods
        forecast = f"""
{period['name']}: Temperature: {period['temperature']}°{period['temperatureUnit']}
Wind: {period['windSpeed']} {period['windDirection']}
Forecast: {period['detailedForecast']}
"""
        forecasts.append(forecast)

    return "\n---\n".join(forecasts)
    

if __name__ == "__main__":
    mcp.run(transport='stdio')


    https://www.youtube.com/watch?v=zrs_HWkZS5w&t=11s