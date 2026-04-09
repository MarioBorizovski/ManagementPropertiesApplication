# Enterprise Property Booking System 🏢

A comprehensive, full-stack application built to handle real estate property listings, agent approvals, user bookings, and reviews. 

I built this project to demonstrate a robust understanding of modern web application architecture, bridging a highly secure **Spring Boot** backend with a dynamic, component-driven **React** frontend. 

## 🌟 Key Features

### Role-Based Access Control
- **Admins:** The top level. Admins can view all users, manage platform-wide bookings, and approve or reject new properties submitted by agents.
- **Agents:** Real estate managers who can create rich property listings, upload multiple images, and accept or reject user booking requests.
- **Users:** Everyday users who can search for properties with filters, make bookings, and leave rated reviews after their stay.

### Security & Architecture
- **JWT Authentication:** Complete token-based authentication seamlessly bridging Spring Security and React Context.
- **Password Reset Flow:** Full async email flow using `JavaMailSender` (configured for Mailtrap) and securely hashed, time-limited reset tokens.
- **Separation of Concerns:** The React codebase is strictly decoupled; complex "god components" are broken down into elegant presentation UI components and smart container pages. 
- **Automated Testing:** Covered by a comprehensive suite of **18 tests** utilizing `JUnit 5`, `Mockito`, and `MockMvc` to guarantee business logic integrity and secure HTTP routing endpoints.

## 💻 Tech Stack

**Backend:**
- Java 21 & Spring Boot 3.2.2
- Spring Data JPA & PostgreSQL
- Spring Security & structure JSON Web Tokens (JJWT)
- JUnit 5 & Mockito (Unit/Integration Testing)
- JavaMailSender (Async Emails)

**Frontend:**
- React 18 & Vite
- Tailwind CSS (For clean, custom utility styling)
- React Router DOM
- Axios (API Client)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Java 21](https://jdk.java.net/21/), [Node.js 18+](https://nodejs.org/), and [PostgreSQL](https://www.postgresql.org/) installed.

### 1. Database Setup
Create a local database in your PostgreSQL instance:
```sql
CREATE DATABASE property_management_db;
```

### 2. Environment Variables
This project relies on environment variables for security. You can configure them in your IDE, or run the app via terminal with them exported.

**Backend required variables:**
- `DB_USERNAME`: Postgres username (e.g., postgres)
- `DB_PASSWORD`: Postgres password
- `APP_FRONTEND_URL`: URL of the frontend (defaults to `http://localhost:5173`)

### 3. Run the Backend
You can boot the Spring Boot server directly using the Maven wrapper:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```
*Note: The app runs on port `8080` by default. On startup, `DataSeeder` will automatically populate basic roles and an Admin test user (`admin@gmail.com` / `admin`).*

### 4. Run the Frontend
In a new terminal window, navigate to the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing

The backend is fully verified using Spring Boot Test context and Mockito. To run the automated tests locally:
```bash
.\mvnw.cmd test
```
*Data safety: The integration tests use Spring's `@Transactional` annotation against the live database, meaning any dummy test data inserted is automatically rolled back and will never poison your actual development database!*
