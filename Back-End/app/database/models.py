from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # 'caregiver' or 'patient'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patients = relationship("Patient", back_populates="caregiver")
    patient_profile = relationship("Patient", back_populates="user", uselist=False)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    condition = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    caregiver_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="patient_profile")
    caregiver = relationship("User", foreign_keys=[caregiver_id], back_populates="patients")
    medical_files = relationship("MedicalFile", back_populates="patient")
    chat_logs = relationship("ChatLog", back_populates="patient")

class MedicalFile(Base):
    __tablename__ = "medical_files"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    filename = Column(String)
    file_type = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    embedding_id = Column(String)  # Reference to ChromaDB embedding

    # Relationships
    patient = relationship("Patient", back_populates="medical_files")

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    message = Column(String)
    response = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sentiment = Column(String, nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="chat_logs") 