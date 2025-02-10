from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import requests
from datetime import datetime

from app.database.database import get_db
from app.database.models import User, Patient
from app.core.security import get_current_active_user
from app.core.rag import get_relevant_context
from app.config import settings
from app.schemas.chat_log import ChatLog  # Import the new ChatLog schema

router = APIRouter()

@router.post("/chat/{patient_id}")
async def chat(
    patient_id: int,
    message: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify user has access to this patient
    patient = None
    if current_user.role == "caregiver":
        patient = db.query(Patient).filter(
            Patient.id == patient_id,
            Patient.caregiver_id == current_user.id
        ).first()
    elif current_user.role == "patient":
        patient = db.query(Patient).filter(
            Patient.id == patient_id,
            Patient.user_id == current_user.id
        ).first()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found or not authorized"
        )

    # Get relevant context from medical history
    context = await get_relevant_context(patient_id, message)
    
    # Prepare prompt with context
    system_prompt = f"""You are an AI assistant for Alzheimer's patients. 
    Use the following context about the patient to provide accurate and helpful responses:
    {' '.join(context)}
    
    Always be patient, clear, and compassionate in your responses."""

    # Get response from OpenRouter API
    response = requests.post(
        "https://api.openrouter.ai/v1/chat",  # Update with the correct OpenRouter endpoint
        json={
            "model": "DeepSeek-R1",  # Specify the model you want to use
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ]
        },
        headers={"Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"}
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    response_data = response.json()

    # Save chat log
    chat_log = ChatLog(
        patient_id=patient_id,
        message=message,
        response=response_data['choices'][0]['message']['content'],
        sentiment="neutral"  # You can add sentiment analysis here
    )
    db.add(chat_log)
    db.commit()

    return {
        "response": response_data['choices'][0]['message']['content'],
        "timestamp": datetime.utcnow()
    }

@router.get("/chat_history/{patient_id}", response_model=List[ChatLog])
async def get_chat_history(
    patient_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify user has access to this patient
    if current_user.role == "caregiver":
        patient = db.query(Patient).filter(
            Patient.id == patient_id,
            Patient.caregiver_id == current_user.id
        ).first()
    elif current_user.role == "patient":
        patient = db.query(Patient).filter(
            Patient.id == patient_id,
            Patient.user_id == current_user.id
        ).first()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found or not authorized"
        )

    return db.query(ChatLog).filter(ChatLog.patient_id == patient_id).all() 