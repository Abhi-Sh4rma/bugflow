# 🔴 BugFlow — AI-Powered Bug Bounty Hunting Platform

![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![React](https://img.shields.io/badge/React-18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

> An industry-level AI-powered bug bounty hunting platform that automates
> the entire security testing workflow — from recon to report submission.
> Built by **Abhishek Sharma** — Offensive Security Learner | Bug Bounty Hunter

---

## 🎯 What Is BugFlow?

BugFlow is a full-stack web platform that helps bug bounty hunters manage
their entire workflow in one place. It combines automated recon, AI-powered
vulnerability analysis, and professional report generation.

**One platform. Full bug bounty workflow.**

---

## ⚡ Features

- 🔐 **JWT Authentication** — Secure register & login system
- 🎯 **Target Manager** — Manage all bug bounty targets
- 🔍 **Auto Recon Engine** — Powered by ReconAI (Subdomain, DNS, Ports, CVEs)
- 🤖 **AI Vulnerability Analyzer** — Groq AI powered analysis
- 📝 **Report Generator** — HackerOne/Bugcrowd ready reports
- 📊 **Dashboard** — Track findings, targets, and progress
- 🐳 **Docker Support** — Easy deployment anywhere

---

## 🏗️ Architecture
```
bugflow/
│
├── backend/                  ← FastAPI Python Backend
│   ├── app/
│   │   ├── main.py           ← App entry point
│   │   ├── core/
│   │   │   ├── config.py     ← Settings & env vars
│   │   │   ├── database.py   ← PostgreSQL connection
│   │   │   └── security.py   ← JWT & password hashing
│   │   ├── models/
│   │   │   ├── user.py       ← User database model
│   │   │   └── scan.py       ← Scan database model
│   │   ├── schemas/
│   │   │   ├── user.py       ← User request/response schemas
│   │   │   └── scan.py       ← Scan request/response schemas
│   │   └── api/
│   │       └── routes/
│   │           ├── auth.py   ← Register & Login endpoints
│   │           ├── scans.py  ← Scan management endpoints
│   │           └── dashboard.py ← Dashboard endpoints
│   └── requirements.txt
│
├── frontend/                 ← React Frontend (coming soon)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TailwindCSS |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL |
| **Auth** | JWT + bcrypt |
| **AI** | Groq (Llama3) |
| **Recon Engine** | ReconAI (custom built) |
| **Deployment** | Docker + Render + Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL
- Node.js 18+

### Backend Setup
```bash
# Clone repo
git clone https://github.com/Abhi-Sh4rma/bugflow.git
cd bugflow/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp ../.env.example ../.env
nano ../.env  # Add your values

# Run server
uvicorn app.main:app --reload --port 8000
```

### API Documentation
```
http://localhost:8000/docs
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/v1/auth/register | Register new user |
| POST | /api/v1/auth/login | Login & get JWT token |
| GET | /api/v1/auth/me | Get current user |
| POST | /api/v1/scans | Start new scan |
| GET | /api/v1/scans | Get all scans |
| GET | /api/v1/scans/{id} | Get scan details |
| GET | /api/v1/dashboard | Get dashboard stats |

---

## 🗺️ Roadmap

- [x] JWT Authentication System
- [x] PostgreSQL Database
- [x] User Registration & Login
- [ ] React Dashboard Frontend
- [ ] Scan Management API
- [ ] ReconAI Engine Integration
- [ ] AI Report Generation
- [ ] Docker Deployment
- [ ] Vercel + Render Hosting

---

## ⚠️ Legal Disclaimer

> This tool is for **educational purposes** and **authorized testing only**.
> Always get **written permission** before scanning any target.
> The author is not responsible for any misuse.

---

## 👨‍💻 Author

**Abhishek Sharma**
- LinkedIn: www.linkedin.com/in/abhishek-sharma-291a42250
- GitHub: [@Abhi-Sh4rma](https://github.com/Abhi-Sh4rma)
- TryHackMe: Top 1%
- IBM Cybersecurity Certified

---

## 📜 License

MIT License — free to use with attribution.
