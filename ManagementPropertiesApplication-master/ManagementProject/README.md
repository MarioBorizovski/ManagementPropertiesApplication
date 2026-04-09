# Enterprise Property Booking System 🏢

A comprehensive, full-stack application built to handle real estate property listings, agent approvals, user bookings, and reviews. 

I built this project to demonstrate a robust understanding of modern web application architecture, bridging a highly secure **Spring Boot** backend with a dynamic, component-driven **React** frontend.

## 🌟 Advanced Technical Features

### 📡 Real-Time Synchronous Messaging
- **STOMP/WebSockets:** Implemented true real-time chat using the STOMP protocol over WebSockets. This allows for immediate notification delivery to the persistent chat window seen in the frontend `App.jsx`.
- **Chat History:** Seamlessly switches between real-time data and historical message fetching via REST endpoints.

### 🛡️ Property Audit & Approval System
- **State Snapshots:** When an agent attempts to edit an already `APPROVED` property, the system takes a snapshot of the current state.
- **Reversion Logic:** The property is moved back to `PENDING`. If an admin rejects the new edits, the system automatically reverts the property to its previous snapshot state, ensuring no downtime for valid listings.

### 🗺️ Geocoding & Map Intelligence
- **Google Maps Interaction:** Integrates the Geocoding REST API to automatically resolve coordinate pairs (Latitude/Longitude) from string addresses.
- **Admin Geocoding Tool:** Includes an admin-only utility to retroactively geocode any properties missing spatial data.

### 📧 Comprehensive Email Workflow
- **System-Wide Notifications:** Integrated `JavaMailSender` for:
  - User Registration Verification.
  - Password Reset Token delivery.
  - Property Pending/Approved/Rejected alerts for Agents.
- **Async Execution:** Email notifications are processed asynchronously to ensure non-blocking API performance.

## 💻 Tech Stack

**Backend:**
- Java 21 & Spring Boot 3.2.2
- Spring Data JPA & PostgreSQL
- Spring Security & Stateless JWT (JJWT)
- JUnit 5 & Mockito (Unit/Integration Testing)
- JavaMailSender (Async Emails)

**Frontend:**
- React 18 & Vite
- Tailwind CSS (Premium custom design system)
- Framer-inspired animations and micro-interactions
- Google Maps JavaScript API (including Places Autocomplete)

## 🚀 Getting Started

### Prerequisites
- **Java 21 JDK**
- **Node.js 18+**
- **PostgreSQL**
- **Google Maps API Key:** Required for maps and address autocomplete.
- **Mailtrap SMTP:** Required for testing the email verification and reset flows.

### 1. Database Setup
Create a local database in your PostgreSQL instance:
```sql
CREATE DATABASE property_management_db;
```

### 2. Environment Variables
Configure the following in your IDE or `.env` file:
- `DB_USERNAME`: Postgres username
- `DB_PASSWORD`: Postgres password
- `APP_GOOGLE_MAPS_API_KEY`: Your Google Cloud Console key.
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: From your Mailtrap dashboard.

### 3. Run the Backend
```bash
# Windows
.\mvnw.cmd spring-boot:run
```
*Note: The app runs on `8080`. On startup, `DataSeeder` populates an Admin user (`admin@gmail.com` / `admin`).*

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing
The backend is fully verified using Spring Boot Test context and Mockito:
```bash
.\mvnw.cmd test
```
*Note: Integration tests use `@Transactional` to ensure a clean database state after every run.*
