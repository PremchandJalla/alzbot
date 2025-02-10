from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PatientBase(BaseModel):
    name: str
    age: int
    condition: str

class PatientCreate(PatientBase):
    pass

class MedicalFileBase(BaseModel):
    filename: str
    file_type: str

class MedicalFileCreate(MedicalFileBase):
    patient_id: int

class MedicalFile(MedicalFileBase):
    id: int
    file_path: str
    uploaded_at: datetime
    embedding_id: Optional[str]

    class Config:
        from_attributes = True

class Patient(PatientBase):
    id: int
    user_id: Optional[int]
    caregiver_id: int
    created_at: datetime
    last_active: datetime
    medical_files: List[MedicalFile] = []

    class Config:
        from_attributes = True 