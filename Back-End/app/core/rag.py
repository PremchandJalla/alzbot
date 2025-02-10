import chromadb
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader, PyMuPDFLoader
import os
from typing import List

# Initialize ChromaDB with the new client configuration
chroma_client = chromadb.PersistentClient(path="chroma_db")

# Create collections for each patient
def get_patient_collection(patient_id: int):
    collection_name = f"patient_{patient_id}_docs"
    try:
        return chroma_client.get_collection(collection_name)
    except:
        return chroma_client.create_collection(collection_name)

async def process_medical_file(file_path: str, patient_id: int) -> str:
    # Load document based on file type
    if file_path.endswith('.pdf'):
        loader = PyMuPDFLoader(file_path)
    else:
        loader = TextLoader(file_path)
    
    documents = loader.load()
    
    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    
    # Get patient's collection
    collection = get_patient_collection(patient_id)
    
    # Add documents to ChromaDB
    texts = [chunk.page_content for chunk in chunks]
    metadatas = [chunk.metadata for chunk in chunks]
    
    collection.add(
        documents=texts,
        metadatas=metadatas,
        ids=[f"doc_{patient_id}_{i}" for i in range(len(texts))]
    )
    
    return f"doc_{patient_id}_{len(texts)}"  # Return a unique identifier

async def get_relevant_context(patient_id: int, query: str) -> List[str]:
    collection = get_patient_collection(patient_id)
    
    # Search for relevant documents
    results = collection.query(
        query_texts=[query],
        n_results=3
    )
    
    return results['documents'][0] 