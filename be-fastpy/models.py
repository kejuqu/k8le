from typing import Optional
from pydantic import BaseModel


class MsgPayload(BaseModel):
    msg_id: Optional[int]
    msg_name: str


class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: Optional[str] = None
