# SDP-Project-Banking-Simulator
Hello Dr Hamza, this is our repository showcasing the progression and thorough documentation of the Banking Simulator we have chosen to implement. We shall be collaborating on implementing new features each week while hitting the milestones as drawn out in the semester roadmap!

# 🏦 Banking Simulator

A full-stack Banking System Simulator designed to replicate core real-world banking operations. This project demonstrates secure account management, transaction processing, and financial reporting through a modern web application architecture.

---

## 📌 Overview

The Banking Simulator is a collaborative project built to simulate essential banking functionalities such as account creation, transactions, security validation, and reporting. It features a responsive frontend and a robust backend with persistent data storage and automated financial logic.

The system enables users to:

* Manage accounts
* Perform secure transactions
* Track financial activity
* Generate reports
* Experience realistic banking workflows

---

## 🧱 Tech Stack

| Layer       | Technology                |
| ----------- | ------------------------- |
| Frontend    | HTML, CSS, JavaScript     |
| Backend     | Flask (Python)            |
| ORM / Data  | SQLAlchemy + SQL Database |
| Versioning  | Git & GitHub              |
| Persistence | JSON backup system        |

---

## ✨ Core Features

### 👤 Account Management

* User registration and account creation
* Account deletion with full data cleanup
* Real-time balance display

### 💸 Transactions

* Deposit funds into accounts
* Withdraw funds with balance validation
* Transfer money between users (atomic operations)

### 🔐 Security

* PIN-based authentication (hashed storage)
* Automatic account lock after 3 failed attempts

### 📊 Data & Reporting

* Transaction history logs (searchable)
* Printable account summary reports
* Monthly interest calculation (2% automated)

### 💾 Data Persistence

* Automatic database export to JSON after updates
* System recovery from saved state

---

## 🏗️ Project Structure

```id="n3k2zp"
/app             → Flask application (routes, controllers)
/templates       → HTML templates (Jinja2)
/static          → CSS, JavaScript, assets
/database        → SQLAlchemy models & schema
/scripts         → Backup & utility scripts
/docs            → API documentation
```

---

## 📛 Naming Conventions

To ensure consistency and maintainability:

### Frontend

* HTML files: `feature-name.html`
* CSS files: `feature-name.css`
* JS files: `feature-name.js`

### Backend (Flask)

* Routes: `feature_routes.py`
* Services: `feature_service.py`
* Models: `PascalCase` (e.g., `UserAccount`)

### Database

* Tables: `snake_case` (e.g., `user_accounts`)
* Fields: `snake_case`

### Git Branches

* Feature branches: `feature/<feature-name>`
* Bug fixes: `fix/<issue-name>`
* Releases: `release/<version>`

---

## 🔄 CI/CD Pipeline

The project follows a structured CI/CD workflow to ensure code quality and smooth integration.

### Continuous Integration

* Triggered on every pull request
* Runs:

  * Linting (Python + JavaScript)
  * Unit tests
  * Build validation

### Continuous Deployment

* Triggered on merge to `main`
* Steps:

  1. Install dependencies
  2. Run tests
  3. Start Flask application build
  4. Deploy to staging/production (configurable)

### Git Workflow

* All changes go through Pull Requests
* Code reviews required before merge
* Feature branches merged into `main`

---

## 🚀 Getting Started

### Prerequisites

* Python 3.x
* pip
* Git

### Installation

```bash id="q7m2hf"
# Clone repository
git clone <repo-url>

# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Run the Application

```bash id="s8x4ld"
# Start Flask server
flask run
```

Then open your browser at:

```
http://127.0.0.1:5000
```

---

## 🗺️ Development Roadmap

### ✅ Phase 1 (Weeks 1–2)

* Project setup
* Repository structure
* Basic Flask app scaffolding

### ✅ Phase 2 (Weeks 3–4)

* Account creation & deletion (end-to-end)
* Initial frontend-backend integration

### ✅ Phase 3 (Weeks 5–7)

* Deposit & withdrawal systems
* Security features (PIN, lockouts)

### 🔄 Phase 4 (Weeks 8–9)

* Transaction logs
* Interest calculation engine
* Reporting features

### 🎯 Phase 5 (Week 10)

* Final testing
* Bug fixes
* Documentation & presentation

---

## ⚠️ Challenges & Considerations

### Synchronization

Ensuring frontend and backend remain compatible through clear route and API design.

### Security

* Use hashed PINs
* Prevent SQL injection
* Validate all user inputs

### Collaboration

* Avoid merge conflicts via feature branches
* Maintain consistent coding standards

---

## ✅ Success Criteria

The project is considered complete when:

* All 12 core features are fully functional
* Data persists correctly and reloads without errors
* Security mechanisms work reliably
* Codebase is clean, modular, and well-documented

---

## 👥 Team Responsibilities

| Member  | Focus Area                 |
| ------- | -------------------------- |
| Fadi    | Account management & UI    |
| Nabil   | Transactions & persistence |
| Anar    | Security & interest logic  |
| Mikhail | Logs, reports & auditing   |

---

## 📄 License

This project is for educational purposes.

---

## 💡 Future Improvements

* Role-based authentication (admin/user)
* Real-time notifications
* Advanced analytics dashboard
* Cloud-based database integration
* Mobile responsiveness enhancements

---

## 📬 Contact

For questions or collaboration, please open an issue or reach out via the repository.

---
