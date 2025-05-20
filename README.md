# 📄 ProposalPilot – Intelligent RFP Analysis for Strategic Decision-Making

ProposalPilot is an AI-powered web platform that simplifies the process of responding to complex Requests for Proposals (RFPs). By leveraging advanced NLP models and modern web technologies, the system automatically compares RFP documents against proposal responses, identifies compliance gaps, and provides actionable insights.

---

## 🧠 Key Features

- 🧾 **Automated RFP & Proposal Parsing** – Upload PDF/DOCX files for smart document analysis.
- 🔍 **AI-Powered Gap Detection** – Identify mismatches and compliance issues using LLMs.
- 📊 **Interactive Dashboard** – Visual representation of clause-level comparison results.
- 📤 **Downloadable Reports** – Generate structured PDF/CSV gap reports.
- 🗂 **Secure File Handling** – Temporary, sanitized document processing.
- 💬 **(Optional)** Chat Interface for Q&A from document context.

---

## 🎯 Objectives

- Automate the manual and error-prone RFP analysis process.
- Compare RFPs and responses using semantic understanding.
- Identify missing, inconsistent, or misaligned content.
- Deliver real-time analysis and feedback to users.
- Leverage Groq’s LLMs with LangChain for deep document comprehension.

---

## ⚙️ Tech Stack

### 🔐 Backend
- **Language & Frameworks**: Python 3.x, FastAPI, Uvicorn
- **AI/NLP**: Groq LLM via LangChain, Retrieval-Augmented Generation (RAG)
- **Database**: MongoDB (Atlas), Firebase (Optional – Auth/Chat)
- **Security**: JWT, OAuth 2.0, bcrypt, CORS, Helmet

### 🌐 Frontend
- **Framework**: React.js (Vite / Next.js), TypeScript
- **Styling**: Tailwind CSS, Material UI / Ant Design
- **State Management**: Redux / Context API
- **Routing & API**: React Router, Axios

---

## 📦 Installation

### 🔧 Backend (FastAPI)
bash
cd ProposalPilot-Backend
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
🌐 Frontend (React)
bash
Copy
Edit
cd ProposalPilot-Frontend
npm install
npm run dev
☁️ Deployment
Frontend: Vercel

Backend: AWS EC2 / Render / DigitalOcean

Database: MongoDB Atlas

Domain/SSL: GoDaddy / Cloudflare

🖼️ System Architecture
css
Copy
Edit
[ User ]
   ⬇️ Upload
[ React Frontend (Vite, Tailwind) ]
   ⬇️ API Calls
[ FastAPI Backend ]
   ⬇️
[ LangChain + Groq LLM ]
   ⬇️
[ MongoDB Atlas (Storage) ]
🚀 Usage
Start both backend and frontend servers.

Open the browser at http://localhost:3000.

Upload your RFP and proposal documents.

View the analysis and download reports.

Optionally, ask questions using the AI chat assistant.

📌 Functional Requirements
Upload and parse documents (PDF/DOCX).

NLP-powered compliance gap detection.

Download analysis reports.

Real-time feedback and interactive visualizations.

🔒 Non-Functional Requirements
High security with JWT auth.

Responsive UI for mobile and desktop.

High availability (99.9% uptime).

Scalable backend handling multiple users/documents.

🧭 Future Enhancements
✅ Real-time team collaboration & annotations

🤖 Smart auto-generated proposal sections

📁 Integration with Google Drive / SharePoint

📊 Enhanced analytics dashboards (e.g., success scores)

🌐 Multi-language document support

👩‍💻 Team Members
Name	            
Akshada Mane : https://github.com/AkshadaMane26
Manasi Bharati	

Project Guide: Dr. L. A. Bewoor
Institution: Vishwakarma Institute of Information Technology, Pune

📚 References
AI RFP Response Automation - Addepto

Gap Analysis Automation – VisibleThread

Evaluating AI for Federal RFP Proposal Writing – GovBrief

Research proposal content extraction using NLP

📄 License
This project is licensed under the MIT License. See LICENSE file for details.

Empowering smarter, faster RFP responses with AI.



---


