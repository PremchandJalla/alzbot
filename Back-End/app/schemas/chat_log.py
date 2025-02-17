from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChatLogBase(BaseModel):
    patient_id: int
    message: str
    response: str
    sentiment: str

class ChatLog(ChatLogBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    status: str 