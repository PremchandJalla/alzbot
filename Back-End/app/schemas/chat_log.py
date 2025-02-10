from pydantic import BaseModel
from datetime import datetime

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