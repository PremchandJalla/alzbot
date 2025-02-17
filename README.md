# 🚀 Alzheimer's Care Companion Chatbot

A Proof-of-Concept (POC) chatbot leveraging **OpenRouter API** with the **DeepSeek model** to assist Alzheimer’s patients and caregivers.

---

## 📌 Features

- ✅ **Chatbot API using OpenRouter (DeepSeek)**
- ✅ **FastAPI Backend (No authentication in POC)**
- ✅ **Next.js Frontend (Chat interface for patients & caregivers)**
- ✅ **Multi-Patient Support (Future Enhancement)**
- ✅ **File Upload for Medical Records (Future RAG Integration)**

---

## 🛠️ Setup Instructions (Run Locally)

### 1️⃣ Clone the Repository
```bash
git clone git@github.com:PremchandJalla/alzbot.git
cd alzbot
```

### 2️⃣ Backend Setup (FastAPI)
```bash
cd Back-End
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### 🔹 Create a `.env` File for API Keys
```ini
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

#### 🔹 Run the FastAPI Backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- **Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3️⃣ Frontend Setup (Next.js)
```bash
cd ../Front-End
npm install
npm run dev
```
- Open **[http://localhost:3000](http://localhost:3000)** to see the chatbot UI.

---

## 🚀 Contributing Guidelines

We follow a **branch-based workflow** for all development.

### 🔹 1️⃣ Create Your Own Dev Branch
- **Do NOT push directly to `main`**
- Always create a **feature or bugfix branch** before making changes.
```bash
git checkout -b dev/yourname
```

### 🔹 2️⃣ Make Your Changes & Commit
```bash
git add .
git commit -m "Added OpenRouter API integration"
```

### 🔹 3️⃣ Push Your Branch & Raise a PR
```bash
git push origin dev/yourname
```
- Go to GitHub → Open a **Pull Request (PR)** to merge into `main`.
- The **PR must be reviewed** before merging.

### 🔹 4️⃣ Sync with `main` Before Merging
```bash
git checkout main
git pull origin main
git checkout dev/yourname
git merge main
```
- This avoids conflicts before merging.

---

## 🎯 Future Enhancements
- 🔹 **Implement RAG for personalized medical history**
- 🔹 **User authentication & caregiver dashboard**
- 🔹 **Real-time chatbot responses with WebSockets**
- 🔹 **Cloud deployment on Render/Vercel**

---

## 🤝 Contributors
- **Premchand Jalla** (Project Owner)


🚀 If you're contributing, create a **`dev/yourname`** branch and submit PRs!
