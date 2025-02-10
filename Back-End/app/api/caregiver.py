from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
import os
from datetime import datetime

from app.database.database import get_db
from app.database.models import User, Patient, MedicalFile
from app.schemas.patient import PatientCreate, Patient as PatientSchema, MedicalFile as MedicalFileSchema
from app.core.security import get_current_active_user
from app.core.rag import process_medical_file
from app.config import settings

router = APIRouter()

@router.get("/patients", response_model=List[PatientSchema])
async def get_patients(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "caregiver":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view patients"
        )
    return db.query(Patient).filter(Patient.caregiver_id == current_user.id).all()

@router.post("/patients", response_model=PatientSchema)
async def create_patient(
    patient: PatientCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "caregiver":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to create patients"
        )
    
    db_patient = Patient(
        **patient.dict(),
        caregiver_id=current_user.id
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.post("/upload_medical_history/{patient_id}", response_model=MedicalFileSchema)
async def upload_medical_file(
    patient_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify patient belongs to caregiver
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.caregiver_id == current_user.id
    ).first()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found or not authorized"
        )

    # Create uploads directory if it doesn't exist
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, f"{patient_id}_{file.filename}")
    with open(file_path, "wb+") as file_object:
        file_object.write(await file.read())

    # Process file for RAG
    embedding_id = await process_medical_file(file_path, patient_id)

    # Create medical file record
    db_file = MedicalFile(
        patient_id=patient_id,
        filename=file.filename,
        file_type=file.content_type,
        file_path=file_path,
        embedding_id=embedding_id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    return db_file

@router.get("/medical_files/{patient_id}", response_model=List[MedicalFileSchema])
async def get_medical_files(
    patient_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Verify patient belongs to caregiver
    patient = db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.caregiver_id == current_user.id
    ).first()
    
    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found or not authorized"
        )

    return db.query(MedicalFile).filter(MedicalFile.patient_id == patient_id).all() 