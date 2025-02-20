from fastapi import APIRouter, HTTPException
import logging
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional, List
from openai import OpenAI
from app.config import settings
import re

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize OpenAI client
deepseek_client = OpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1"
)

mistral_client = OpenAI(
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

# First define REMINDER_KEYWORDS before using it in ALERT_TYPES
REMINDER_KEYWORDS = {
    'remind me': 'general',
    'set reminder': 'general',
    'don\'t forget': 'general',
    'remember to': 'general',
    'need to remember': 'general',
    'medication reminder': 'medication',
    'medicine reminder': 'medication',
    'appointment reminder': 'appointment',
    'doctor reminder': 'appointment'
}

# First define STOP_WORDS before using it in ALERT_TYPES
STOP_WORDS = {
    'die': 'death/mortality related',
    'hate': 'strong negative emotion',
    'kill': 'violence related',
    'suicide': 'self-harm related',
    'murder': 'violence related',
    'dead': 'death/mortality related',
    'hurt': 'harm related',
    'harm': 'harm related',
    'cruel': 'negative behavior',
    'violent': 'violence related',
    'weapon': 'violence related',
    'abuse': 'harm related',
    'suffer': 'distress related',
    'painful': 'distress related',
    'terrible': 'strong negative emotion',
    'awful': 'strong negative emotion'
}

# Then define ALERT_TYPES using both STOP_WORDS and REMINDER_KEYWORDS
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
    },
    'TIME_CONFUSION': {
        'keywords': ['what day', 'what time', 'what date', 'which day', 'today date'],
        'severity': 'medium',
        'message': 'Alert: Pam is asking about date/time. Possible temporal disorientation.'
    },
    'STOP_WORD_DETECTED': {
        'keywords': list(STOP_WORDS.keys()),
        'severity': 'high',
        'message': 'Alert: Concerning language detected in conversation. Immediate attention required.'
    },
    'REMINDER_SET': {
        'keywords': list(REMINDER_KEYWORDS.keys()),
        'severity': 'low',
        'message': 'New reminder has been set.'
    }
}

# Add this at the top with other constants
GREETING_KEYWORDS = {
    'hey', 'hi', 'hello', 'good morning', 'good afternoon', 
    'good evening', 'howdy', 'hiya'
}

GREETING_RESPONSES = {
    'patient': "Hi Pam! How can I help you today?",
    'caregiver': "Hello Laurel! How can I assist you with Pam's care today?"
}

# Add these constants at the top with other constants
CASE_SCENARIOS = {
    'PAM_WORK_ANXIETY': {
        'keywords': ['work', 'getting ready', 'job', 'late for work', 'need to work'],
        'context': "Pam is anxiously getting ready for work at 2 AM, even though she retired 7 years ago.",
        'strategy': 'Reorient',
        'response': "Mom, look outside - it's still dark out. It's nighttime and time for sleep. I'll help you get back to bed, and I promise I'll wake you when it's time to get up. Everything is okay."
    }
    # Add more scenarios as needed
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
    reminder_set: bool = False
    reminder_details: Optional[dict] = None

def check_for_alerts(message: str) -> tuple[bool, str, str, str]:
    """
    Check message for any alerts and return alert status, type, message, and severity
    """
    message_lower = message.lower()
    
    for alert_type, config in ALERT_TYPES.items():
        if any(keyword in message_lower for keyword in config['keywords']):
            return True, alert_type, config['message'], config['severity']
    
    return False, "", "", ""

def is_simple_greeting(message: str) -> bool:
    """Check if the message is a simple greeting"""
    return message.lower().strip() in GREETING_KEYWORDS

def check_for_stop_words(message: str) -> tuple[bool, str]:
    """Check message for stop words and return status and category"""
    message_lower = message.lower()
    
    for word, category in STOP_WORDS.items():
        if word in message_lower:
            return True, category
    
    return False, ""

def check_for_case_scenario(message: str) -> tuple[bool, str, str]:
    """Check if message matches a case scenario and return scenario details"""
    message_lower = message.lower()
    
    for scenario_id, scenario in CASE_SCENARIOS.items():
        if any(keyword in message_lower for keyword in scenario['keywords']):
            return True, scenario['strategy'], scenario['response']
    
    return False, "", ""

async def get_filtered_response(initial_response: str) -> str:
    """
    Extract only the actual answer from the response, removing reasoning, metadata, and extra context.
    """
    # Common patterns for metadata and reasoning to remove
    patterns_to_remove = [
        r'(?i)the user asked.*?[.:]',   # Removes "The user asked" phrases
        r'(?i)the AI responded.*?[.:]', # Removes "The AI responded" phrases
        r'(?i)i\'m Pam.*?[.:]',         # Removes "I'm Pam" phrases
        r'(?i)pam said.*?[.:]',         # Removes "Pam said" phrases
        r'(?i)because.*?[.,]',          # Removes reasoning starting with "because"
        r'(?i)this is due to.*?[.,]',   # Removes explanations
        r'(?i)the reason is.*?[.,]',    # Removes reasoning
        r'(?i)let me explain.*?[.,]',   # Removes explanation intros
        r'(?i)this means that.*?[.,]',  # Removes interpretations
        r'(?i)in other words.*?[.,]',   # Removes restatements
    ]

    # First try using Mistral for intelligent filtering
    system_prompt = """You are an AI response filter. Your job is to:

    Extracts only the direct answer from the AI response, removing instructions, reasoning, and formatting.

    
    Example:
    Input: "The user asked about medication. Because it's important for your health, you should take the blue pill with water at 9 AM."
    Output: "You should take the blue pill with water at 9 AM."
    """

    try:
        # Try Mistral filtering first
        completion = mistral_client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://alzheimers-care-companion.com",
                "X-Title": "Alzheimer's Care Companion"
            },
            model="mistralai/mistral-7b-instruct:free",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Clean this response: {initial_response}"}
            ]
        )
        
        filtered_response = completion.choices[0].message.content

        # Apply regex patterns as a backup/additional cleaning
        cleaned_response = filtered_response
        for pattern in patterns_to_remove:
            cleaned_response = re.sub(pattern, '', cleaned_response)
        
        # Clean up any double spaces or periods
        cleaned_response = re.sub(r'\s+', ' ', cleaned_response)
        cleaned_response = re.sub(r'\.+', '.', cleaned_response)
        cleaned_response = cleaned_response.strip()

        return cleaned_response if cleaned_response else filtered_response

    except Exception as e:
        logger.error(f"Error in Mistral filtering: {str(e)}")
        
        # Fallback to regex-only cleaning if Mistral fails
        cleaned_response = initial_response
        for pattern in patterns_to_remove:
            cleaned_response = re.sub(pattern, '', cleaned_response)
        
        cleaned_response = re.sub(r'\s+', ' ', cleaned_response)
        cleaned_response = re.sub(r'\.+', '.', cleaned_response)
        return cleaned_response.strip()

@router.post("/chat", response_model=ChatResponse)
async def chat(message: ChatMessage):
    logger.debug(f"Received chat request with message: {message.message}")
    
    try:
        # Check for stop words first
        has_stop_word, stop_category = check_for_stop_words(message.message)
        if has_stop_word:
            response = generate_stop_word_response(stop_category, message.user_type)
            return create_chat_response(response, message, has_stop_word=True)

        # Check for case scenario
        has_scenario, strategy, scenario_response = check_for_case_scenario(message.message)
        if has_scenario:
            return create_chat_response(scenario_response, message, has_scenario=True)

        # Check if it's a simple greeting
        if is_simple_greeting(message.message):
            return {
                "response": GREETING_RESPONSES[message.user_type],
                "timestamp": datetime.utcnow().isoformat(),
                "status": "success",
                "alert": False,
                "alert_message": "",
                "alert_type": "",
                "severity": "",
                "conversation_flag": None,
                "chat_log": {
                    "timestamp": datetime.utcnow().isoformat(),
                    "user_message": message.message,
                    "bot_response": GREETING_RESPONSES[message.user_type],
                    "user_type": message.user_type,
                    "alert": False
                }
            }

        # Check for alerts first
        has_alert, alert_type, alert_message, severity = check_for_alerts(message.message)
        
        context = get_context_for_message(message, [])
        system_prompt = generate_system_prompt(message.user_type, context, has_alert)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message.message}
        ]

        # Get initial response from DeepSeek
        completion = deepseek_client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://alzheimers-care-companion.com",
                "X-Title": "Alzheimer's Care Companion"
            },
            model="deepseek/deepseek-r1-distill-llama-70b:free",
            messages=messages
        )

        initial_response = completion.choices[0].message.content
        
        # Filter the response through Mistral
        final_response = await get_filtered_response(initial_response)

        # Create chat log with alert information
        chat_log = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_message": message.message,
            "bot_response": final_response,
            "user_type": message.user_type,
            "alert": has_alert,
            "alert_type": alert_type,
            "alert_message": alert_message,
            "severity": severity
        }

        # Check for reminder request
        reminder_set = False
        reminder_details = None
        
        if any(keyword in message.message.lower() for keyword in REMINDER_KEYWORDS):
            reminder_text, reminder_type, reminder_time = extract_reminder_details(message.message)
            reminder_details = {
                "text": reminder_text,
                "type": reminder_type,
                "time": reminder_time.isoformat(),
            }
            reminder_set = True
            
            # Just set the reminder without notifying Laurel
            final_response += f"\nI've set a reminder for {reminder_time.strftime('%I:%M %p')}."

        return {
            "response": final_response,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "success",
            "alert": has_alert,
            "alert_message": alert_message,
            "alert_type": alert_type,
            "severity": severity,
            "conversation_flag": alert_type if has_alert else None,
            "chat_log": chat_log,
            "reminder_set": reminder_set,
            "reminder_details": reminder_details
        }

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

def get_current_datetime():
    """Get current date and time in a human-readable format"""
    now = datetime.now()  # Using local time is fine for this use case
    date_str = now.strftime("%A, %B %d, %Y")  # e.g., "Monday, February 19, 2024"
    time_str = now.strftime("%I:%M %p")       # e.g., "02:30 PM"
    return date_str, time_str

def get_context_for_message(message: ChatMessage, reminders: List[dict]) -> str:
    """Generate context based on Pam's medical history, routines, and current reminders"""
    # Get current date and time
    current_date, current_time = get_current_datetime()
    
    context = f"Current Date and Time:\n"
    context += f"Today is {current_date}\n"
    context += f"Current time is {current_time}\n\n"
    
    context += f"Patient Information:\n"
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
    
    # Add current reminders to context
    if reminders:
        context += "\nCurrent Reminders:\n"
        for reminder in reminders:
            context += f"- {reminder['text']} at {reminder['time']}\n"
    
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
        Keep responses concise and easy to understand. Do not generate reasoning behind your responses.
        
        Important Context:
        {context}
        
        Guidelines:
        1. Keep responses short and simple
        2. Be gentle and reassuring
        3. Remind Pam of her routine when relevant
        4. If she seems confused, suggest checking her schedule
        5. Don't overwhelm her with too much information
        6. DO NOT generate reasoning behind your responses.
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
        6. DO NOT generate reasoning behind your responses.
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

def generate_stop_word_response(category: str, user_type: str) -> str:
    """Generate appropriate response for stop words based on user type"""
    base_response = {
        'patient': ("I notice you're expressing some difficult feelings. "
                   "Let's talk about something more positive, or would you "
                   "like me to contact Laurel for you?"),
        'caregiver': ("I understand this is a challenging situation. "
                     "If you need support, please consider reaching out to "
                     "a healthcare professional or counselor. Would you like "
                     "information about caregiver support services?")
    }

    # Add category-specific additions to the response
    category_additions = {
        'death/mortality related': " I understand this is difficult to talk about.",
        'strong negative emotion': " Let's focus on finding positive solutions.",
        'violence related': " Your safety and well-being are important.",
        'self-harm related': " Your life is valuable and there are people who care about you.",
        'harm related': " Let's make sure everyone stays safe.",
        'negative behavior': " We can work on better ways to handle this situation.",
        'distress related': " It's okay to feel this way, and help is available."
    }

    return base_response[user_type] + category_additions.get(category, "")

def create_chat_response(response: str, message: ChatMessage, 
                        has_stop_word: bool = False, 
                        has_scenario: bool = False) -> ChatResponse:
    """Create standardized chat response"""
    timestamp = datetime.utcnow().isoformat()
    
    # If stop word detected, include alert details
    alert = False
    alert_message = ""
    alert_type = ""
    severity = ""
    
    if has_stop_word:
        alert = True
        alert_type = "STOP_WORD_DETECTED"
        alert_message = ALERT_TYPES['STOP_WORD_DETECTED']['message']
        severity = ALERT_TYPES['STOP_WORD_DETECTED']['severity']
    
    chat_log = {
        "timestamp": timestamp,
        "user_message": message.message,
        "bot_response": response,
        "user_type": message.user_type,
        "has_stop_word": has_stop_word,
        "has_scenario": has_scenario,
        "alert": alert,
        "alert_type": alert_type,
        "alert_message": alert_message,
        "severity": severity
    }

    return {
        "response": response,
        "timestamp": timestamp,
        "status": "success",
        "alert": alert,
        "alert_message": alert_message,
        "alert_type": alert_type,
        "severity": severity,
        "conversation_flag": "stop_word" if has_stop_word else "scenario" if has_scenario else None,
        "chat_log": chat_log
    }

def extract_reminder_details(message: str) -> tuple[str, str, datetime]:
    """Extract reminder text, type and time from message"""
    # Common time patterns
    time_patterns = [
        r'at (\d{1,2}(?::\d{2})?\s*(?:am|pm))',  # "at 3:30pm" or "at 3pm"
        r'in (\d+)\s*(minutes?|hours?|days?)',     # "in 30 minutes" or "in 2 hours"
        r'tomorrow at (\d{1,2}(?::\d{2})?\s*(?:am|pm))',  # "tomorrow at 2pm"
    ]
    
    reminder_text = message
    reminder_type = 'general'
    reminder_time = None
    
    # Determine reminder type
    for keyword, r_type in REMINDER_KEYWORDS.items():
        if keyword in message.lower():
            reminder_type = r_type
            break
    
    # Extract time
    now = datetime.now()
    for pattern in time_patterns:
        match = re.search(pattern, message, re.IGNORECASE)
        if match:
            time_str = match.group(1)
            if 'tomorrow' in message:
                base_date = now.date() + timedelta(days=1)
            else:
                base_date = now.date()
            
            if 'minutes' in time_str:
                mins = int(re.search(r'\d+', time_str).group())
                reminder_time = now + timedelta(minutes=mins)
            elif 'hours' in time_str:
                hrs = int(re.search(r'\d+', time_str).group())
                reminder_time = now + timedelta(hours=hrs)
            else:
                # Handle specific times (e.g., "3:30pm")
                try:
                    time_obj = datetime.strptime(time_str.strip(), '%I:%M%p').time()
                    reminder_time = datetime.combine(base_date, time_obj)
                except ValueError:
                    try:
                        time_obj = datetime.strptime(time_str.strip(), '%I%p').time()
                        reminder_time = datetime.combine(base_date, time_obj)
                    except ValueError:
                        reminder_time = now + timedelta(hours=1)  # default to 1 hour
    
    if not reminder_time:
        reminder_time = now + timedelta(hours=1)  # default reminder time
    
    return reminder_text, reminder_type, reminder_time
