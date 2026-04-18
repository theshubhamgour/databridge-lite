# DataBridge Lite: Setup & Running Guide 🚀

DataBridge Lite is a modern 3-tier application designed to demonstrate seamless connectivity between a **Frontend**, **Backend**, and **Database**.

---

## 🛠 Method 1: Local Development (npm)
Perfect for quick testing and development. The backend is designed to be "zero-config" and will automatically fallback to **SQLite** if a MySQL instance is not detected.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *The server will run on [http://localhost:3000](http://localhost:3000)*

### 2. Frontend Setup
1. **Option A (Simplest):** Just open `frontend/index.html` in your web browser.
2. **Option B (Recommended):** Use a local development server for a better experience. From the **root directory**, run:
   ```bash
   npx serve frontend
   ```
   *Note: If you are already inside the `frontend` folder, run `npx serve .` instead.*

---

## 🐳 Method 2: Individual Docker Containers
Use this method to learn how to build images and link containers manually.

### 1. Create Private Network & Named Volume
```bash
docker network create databridge-net
docker volume create databridge-db-vol
```

### 2. Build and Run Database
```bash
docker build -t databridge-db ./db
docker run -d --name mysql-db \
  --network databridge-net \
  -v databridge-db-vol:/var/lib/mysql \
  databridge-db
```

### 3. Build and Run Backend
```bash
docker build -t databridge-backend ./backend
docker run -d --name api-server --network databridge-net -p 3000:3000 \
  -e DB_HOST=mysql-db \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=appdb \
  databridge-backend
```

### 4. Build and Run Frontend
```bash
docker build -t databridge-frontend ./frontend
docker run -d --name web-ui --network databridge-net -p 8080:80 databridge-frontend
```

---

## 🏗 Method 3: Docker Compose (Recommended)
The most efficient way to orchestrate all services with a single command.

1. Ensure you are in the root directory:
   ```bash
   docker compose up --build -d
   ```

2. To stop everything:
   ```bash
   docker compose down
   ```

---

## 🔗 Access Ports & Health
| Service | URL | Note |
| :--- | :--- | :--- |
| **Frontend** | [http://localhost:8080](http://localhost:8080) | Web Interface |
| **Backend** | [http://localhost:3000](http://localhost:3000) | JSON API |


---

## 📁 System Architecture
- **Frontend**: Lightweight static UI served via Nginx.
- **Backend**: Node.js & Express logic.
- **Database**: MySQL 8.0 with pre-configured schema.
- **Fallbacks**: Backend auto-switches to SQLite for standalone runs.

---

## 🛠 Useful Docker Commands

### **Management**
- **Create Volume**: `docker volume create databridge-db-vol`
- **Inspect Volume**: `docker volume inspect databridge-db-vol`
- **List All Volumes**: `docker volume ls`
- **Create Network**: `docker network create databridge-net`

### **Cleanup**
- **Stop & Remove Containers**: `docker compose down`
- **Remove Everything (Volume included)**: `docker compose down -v`
- **Remove Specific Volume**: `docker volume rm databridge-db-vol`
