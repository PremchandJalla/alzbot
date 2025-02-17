from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.api.chatbot import PAM_DATA

router = APIRouter()

class RoutineUpdate(BaseModel):
    routines: List[str]

class MedicalHistoryUpdate(BaseModel):
    medical_history: List[str]

@router.post("/update-routine")
async def update_routine(routine_data: RoutineUpdate):
    PAM_DATA['routines'] = routine_data.routines
    return {"status": "success", "message": "Routine updated successfully"}

@router.post("/update-medical-history")
async def update_medical_history(history_data: MedicalHistoryUpdate):
    PAM_DATA['medical_history'] = history_data.medical_history
    return {"status": "success", "message": "Medical history updated successfully"} 