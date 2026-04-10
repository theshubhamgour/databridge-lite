# DataBridge Lite: Local Setup & Running Guide 🔗

This document explains how to set up and run the **DataBridge Lite** application on your local machine.

---

## 🏃 Method 1: Docker (Fastest & Easiest)
Use this method if you have Docker installed. It will automatically set up the Frontend, Backend, and MySQL.

1.  **Open your terminal.**
2.  **Navigate to the project directory:**
    ```bash
    cd databridge-lite
    ```
3.  **Build and run the containers:**
    ```bash
    docker compose up --build -d
    ```
4.  **Access the Application:**
    - **Frontend**: [http://localhost:8080](http://localhost:8080)
    - **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Method 2: Zero-Config Local Run (Recommended if Docker fails)
Use this method for instant setup without needing Docker or a MySQL installation. The app will automatically use a local SQLite database.

1.  **Open your terminal.**
2.  **Navigate to the backend folder:**
    ```bash
    cd databridge-lite/backend
    ```
3.  **Install dependencies and start:**
    ```bash
    npm install && npm start
    ```
4.  **Open the Frontend:**
    Open `databridge-lite/frontend/index.html` in your browser.

---

## 🛠 Method 3: Manual MySQL Setup (Advanced)
Use this method if you want to run specifically against a local MySQL instance.

### 1. Database Setup (MySQL)
- Install MySQL, create `appdb`, and import `db/init.sql`.

### 2. Backend Setup
- In `backend`, run `npm install` and `npm start`.
- *Note: If MySQL isn't detected, it will automatically fall back to SQLite.*

### 3. Frontend Setup
- Open `frontend/index.html` or use `npx serve frontend`.

---

## 🏗 Project Overview
- **Structure**: 3-Tier (Frontend ↔ Backend ↔ Database)
- **Tech Stack**: HTML/CSS/JS, Node.js (Express), MySQL.
- **Port 8080**: Frontend (Web UI)
- **Port 3000**: Backend (API)
- **Port 3307**: MySQL (Database - External)
- **Port 3306**: MySQL (Database - Internal Container Port)
