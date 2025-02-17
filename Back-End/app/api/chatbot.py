from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime
from pydantic import BaseModel
from typing import Optional, Tuple
from openai import OpenAI
from app.config import settings

router = APIRouter()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=settings.OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")

# Hardcoded patient data for POC
PAM_DATA = {
    "name": "Pam",
    "age": 72,
    "condition": "Alzheimer's (Moderate)",
    "medical_history": [
        "Diagnosed with Alzheimer's at age 68",
        "Mild hypertension",
        "Occasional confusion during nighttime"
    ],
    "routines": [
        "Wake up at 7 AM",
        "Breakfast at 8 AM",
        "Take medication at 9 AM",
        "Go for a walk at 10 AM",
        "Lunch at 12 PM",
        "Afternoon nap at 2 PM",
        "Dinner at 6 PM",
        "Bedtime at 9 PM"
    ],
    "current_routine": None
}

class ChatMessage(BaseModel):
    message: str
    user_type: str  # 'patient' or 'caregiver'

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    status: str
    alert: bool = False
    alert_message: Optional[str] = None  # Make alert_message optional

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    logger.debug(f"Received chat request with message: {message.message}")
    
    try:
        # Prepare context based on user type and message
        context = get_context_for_message(message)
        
        # Check for routine deviation if message is from patient
        alert, alert_message = check_routine_deviation(message.message) if message.user_type == 'patient' else (False, "")

        # Prepare the message for OpenRouter API
        system_prompt = generate_system_prompt(message.user_type, context, alert)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message.message}
        ]

        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://alzheimers-care-companion.com",
                "X-Title": "Alzheimer's Care Companion"
            },
            model="deepseek/deepseek-r1-distill-llama-70b:free",
            messages=messages
        )

        ai_response = clean_response(completion.choices[0].message.content)

        return {
            "response": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "success",
            "alert": alert,
            "alert_message": alert_message if alert else ""  # Return empty string if no alert
        }

    except Exception as e:
        logger.error(f"Error communicating with OpenRouter API: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with OpenRouter API: {str(e)}"
        )

def get_context_for_message(message: ChatMessage) -> str:
    """Generate context based on Pam's medical history and routines"""
    context = f"Patient Name: {PAM_DATA['name']}\n"
    context += f"Age: {PAM_DATA['age']}\n"
    context += f"Condition: {PAM_DATA['condition']}\n"
    
    if PAM_DATA['medical_history']:
        context += "\nMedical History:\n"
        for item in PAM_DATA['medical_history']:
            context += f"- {item}\n"
    
    if PAM_DATA['routines']:
        context += "\nDaily Routines:\n"
        for routine in PAM_DATA['routines']:
            context += f"- {routine}\n"
    
    return context

def check_routine_deviation(message: str) -> Tuple[bool, str]:
    """Check if the message indicates a deviation from routine"""
    deviation_keywords = ['lost', 'confused', "don't remember", 'where am I', "what time is it", "I forgot"]
    
    if any(keyword in message.lower() for keyword in deviation_keywords):
        return True, "Alert: Pam may be experiencing confusion or deviation from routine. Notify the caregiver."

    return False, ""  # Return empty string if no deviation detected

def generate_system_prompt(user_type: str, context: str, alert: bool) -> str:
    """Generate appropriate system prompt based on user type and context"""
    if user_type == 'patient':
        return f"""You are a compassionate AI assistant for Alzheimer's patients.
        You are speaking with Pam, who has moderate Alzheimer's.
        Be patient, clear, and reassuring in your responses.
        Keep responses concise and easy to understand.
        Context about Pam:
        {context}
        {'Alert: Patient may be experiencing confusion. Provide extra reassurance.' if alert else ''}
        Only provide direct answers to questions without over-explaining your thought process.
        DO NOT give your resoning for the answer, just provide the answer.
        """
    else:
        return f"""You are an AI assistant for Alzheimer's caregivers.
        You are speaking with Laurel, Pam's caregiver.
        Provide professional and detailed responses.
        Context about the patient:
        {context}
        Only provide direct answers to questions without over-explaining your thought process.
        """ 

def clean_response(text: str) -> str:
    """Remove unnecessary AI thought processes and return only the relevant response"""
    unwanted_phrases = [
        "Alright, Pam just asked,", 
        "I need to respond in a way that’s supportive and clear,", 
        "That's a great question, Pam."
    ]
    
    for phrase in unwanted_phrases:
        if phrase in text:
            text = text.split(phrase)[-1].strip()

    return text
