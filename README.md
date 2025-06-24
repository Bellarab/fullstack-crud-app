# Fullstack ToDo List Application

This project is a full-stack ToDo List application with:

- **React** frontend served by Nginx
- **Spring Boot** backend API
- **MySQL** database

The app can be run **with Docker** (recommended) or **without Docker** (manual setup).

---

## Prerequisites

- For Docker setup:

  - Docker installed: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
  - Docker Compose installed (usually comes with Docker Desktop)

- For manual setup:
  - MySQL installed and running locally ([Download here](https://dev.mysql.com/downloads/))
  - Java 17+ and Maven/Gradle installed
  - Node.js and npm installed

---

## Running with Docker (Recommended)

### Setup and Running

1. **Clone this repository**

```bash
git clone <your-repo-url>
cd fullstack-crud-app


2. **Build and start all containers :docker-compose up --build

    This will build and start the following services:
    MySQL database accessible on localhost:3307
    Backend API on localhost:8080
    Frontend React app on localhost:3000

3. Access the app :http://localhost:3000

4. for Stopping the app : docker-compose down


### Running Without Docker (Manual Setup)

1. MySQL Database
    CREATE DATABASE todolist_db;
2. Backend (Spring Boot)
    The backend will be available at:
    http://localhost:8080
3. Frontend (React)
    Navigate to the frontend folder.
    install dependencies and start the development server
        npm install
        npm start
    The React app will run at:
    http://localhost:3000



Project Structure (Simplified)
fullstack-crud-app/
│
├── backend/             # Spring Boot backend code + Dockerfile
├── frontend/            # React frontend + Dockerfile + Nginx config
├── docker-compose.yml   # Docker Compose config
└── README.md

Feel free to open an issue or contact me if you encounter any problems or have questions!
email :bellarabnassim@gmail.com

```
