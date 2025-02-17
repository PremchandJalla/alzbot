from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

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
    "caregiver": "Laurel",
    "routines": [
        "Wake up at 7 AM",
        "Breakfast at 8 AM",
        "Take medication at 9 AM",
        "Go for a walk at 10 AM",
        "Lunch at 12 PM",
        "Afternoon nap at 2 PM",
        "Dinner at 6 PM",
        "Bedtime at 9 PM"
    ]
}

# Add these alert types at the top of the file
ALERT_TYPES = {
    'MEDICATION_MISSED': {
        'keywords': ['missed medication', 'forgot medicine', 'didn\'t take medicine', 'didn\'t take medication'],
        'severity': 'high',
        'message': 'Alert: Pam missed her medication. Immediate attention required.'
    },
    'SLEEP_DISRUPTION': {
        'keywords': ['woke up', 'middle of night', 'can\'t sleep', 'not sleeping', 'awake at night'],
        'severity': 'medium',
        'message': 'Alert: Sleep pattern disruption detected. Monitor for fatigue.'
    },
    'ROUTINE_DEVIATION': {
        'keywords': ['missed breakfast', 'missed lunch', 'missed dinner', 'didn\'t eat', 'forgot to eat'],
        'severity': 'medium',
        'message': 'Alert: Deviation from regular meal routine detected.'
    },
    'CONFUSION': {
        'keywords': ['confused', 'lost', 'don\'t know where', 'what day is it', 'what time is it'],
        'severity': 'high',
        'message': 'Alert: Signs of confusion detected. Check on Pam.'
    },
    'WANDERING': {
        'keywords': ['went outside', 'leaving', 'going out', 'want to go home'],
        'severity': 'high',
        'message': 'Alert: Potential wandering behavior detected. Immediate attention needed.'
    }
}

class ChatMessage(BaseModel):
    message: str
    user_type: str

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    status: str
    alert: bool = False
    alert_message: str = ""
    conversation_flag: Optional[str] = None
    chat_log: Optional[dict] = None

def check_for_alerts(message: str) -> tuple[bool, str, str, str]:
    """
    Check message for any alerts and return alert status, type, message, and severity
    """
    message_lower = message.lower()
    
    for alert_type, config in ALERT_TYPES.items():
        if any(keyword in message_lower for keyword in config['keywords']):
            return True, alert_type, config['message'], config['severity']
    
    return False, "", "", ""

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    logger.debug(f"Received chat request with message: {message.message}")
    
    try:
        # Check for alerts first
        has_alert, alert_type, alert_message, severity = check_for_alerts(message.message)
        
        context = get_context_for_message(message)
        system_prompt = generate_system_prompt(message.user_type, context, has_alert)
        
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

        response = clean_response(completion.choices[0].message.content)

        # Create chat log with alert information
        chat_log = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_message": message.message,
            "bot_response": response,
            "user_type": message.user_type,
            "alert": has_alert,
            "alert_type": alert_type,
            "alert_message": alert_message,
            "severity": severity
        }

        return {
            "response": response,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "success",
            "alert": has_alert,
            "alert_message": alert_message,
            "alert_type": alert_type,
            "severity": severity,
            "conversation_flag": alert_type if has_alert else None,
            "chat_log": chat_log
        }

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

def get_context_for_message(message: ChatMessage) -> str:
    """Generate context based on Pam's medical history and routines"""
    context = f"Patient Information:\n"
    context += f"Name: {PAM_DATA['name']}\n"
    context += f"Age: {PAM_DATA['age']}\n"
    context += f"Condition: {PAM_DATA['condition']}\n"
    context += f"Primary Caregiver: {PAM_DATA['caregiver']}\n\n"
    
    context += "Medical History:\n"
    for item in PAM_DATA['medical_history']:
        context += f"- {item}\n"
    
    context += "\nDaily Routines:\n"
    for routine in PAM_DATA['routines']:
        context += f"- {routine}\n"
    
    # Add relationship context based on user type
    if message.user_type == 'patient':
        context += f"\nRemember: {PAM_DATA['caregiver']} is your caregiver who helps take care of you."
    else:
        context += f"\nYou are {PAM_DATA['caregiver']}, the primary caregiver for {PAM_DATA['name']}."
    
    return context

def generate_system_prompt(user_type: str, context: str, alert: bool) -> str:
    """Generate appropriate system prompt based on user type and context"""
    if user_type == 'patient':
        base_prompt = f"""You are a compassionate AI assistant for Alzheimer's patients.
        You are speaking with Pam, who has moderate Alzheimer's.
        Be patient, clear, and reassuring in your responses.
        Keep responses concise and easy to understand.
        
        Important Context:
        {context}
        
        Guidelines:
        1. Keep responses short and simple
        2. Be gentle and reassuring
        3. Remind Pam of her routine when relevant
        4. If she seems confused, suggest checking her schedule
        5. Don't overwhelm her with too much information
        """
        
        if alert:
            base_prompt += "\nPam seems confused or anxious. Provide extra reassurance and clear guidance."
            
        return base_prompt
    else:
        return f"""You are an AI assistant for Alzheimer's caregivers.
        You are speaking with Laurel, Pam's caregiver.
        Provide professional and detailed responses.
        
        Important Context:
        {context}
        
        Guidelines:
        1. Provide detailed, professional responses
        2. Reference Pam's medical history when relevant
        3. Suggest routine adjustments if needed
        4. Alert about any concerning patterns
        5. Offer evidence-based care suggestions
        """

def clean_response(text: str) -> str:
    """Remove unnecessary AI thought processes and return only the relevant response"""
    unwanted_phrases = [
        "Let me help you with that.",
        "I understand you're asking about",
        "Based on the information provided,",
        "As an AI assistant,",
        "I'll be happy to help you",
        "Let me explain",
    ]
    
    response = text
    for phrase in unwanted_phrases:
        if response.startswith(phrase):
            response = response[len(phrase):].strip()
            if response.startswith(','):
                response = response[1:].strip()
    
    return response
