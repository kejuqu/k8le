from fastapi import FastAPI, HTTPException
from models import MsgPayload, User
import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

app = FastAPI()
messages_list: dict[int, MsgPayload] = {}
users_db: dict[int, User] = {}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Hello"}


# Route to add a message
@app.post("/messages/{msg_name}/")
def add_msg(msg_name: str) -> dict[str, MsgPayload]:
    # Generate an ID for the item based on the highest ID in the messages_list
    msg_id = max(messages_list.keys()) + 1 if messages_list else 0
    messages_list[msg_id] = MsgPayload(msg_id=msg_id, msg_name=msg_name)

    return {"message": messages_list[msg_id]}


# Route to list all messages
@app.get("/messages")
def message_items() -> dict[str, dict[int, MsgPayload]]:
    return {"messages:": messages_list}


# 查询用户列表
@app.get("/api/v1/queryUserList")
def query_user_list() -> dict:
    return {
        "success": True,
        "data": {"list": list(users_db.values())},
        "errorCode": 0
    }


# 更新用户信息
@app.put("/api/v1/user")
def update_user(user: User) -> dict:
    if user.id in users_db:
        users_db[user.id] = user
        return {
            "success": True,
            "data": user,
            "errorCode": 0
        }
    raise HTTPException(
        status_code=404,
        detail={
            "success": False,
            "data": None,
            "errorCode": 1,
            "message": "User not found"
        }
    )


# 删除用户
@app.delete("/api/v1/user/{user_id}")
def delete_user(user_id: int) -> dict:
    if user_id in users_db:
        del users_db[user_id]
        return {
            "success": True,
            "data": None,
            "errorCode": 0
        }
    raise HTTPException(
        status_code=404,
        detail={
            "success": False,
            "data": None,
            "errorCode": 1,
            "message": "User not found"
        }
    )

# 创建用户


@app.post("/api/v1/user")
def create_user(user: User) -> dict:
    users_db[user.id] = user
    return {
        "success": True,
        "data": user,
        "errorCode": 0
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 服务启动中...")
    # 从环境变量获取端口号，如果没有设置则默认使用 8080
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
    print("🚀 服务启动成功！")
