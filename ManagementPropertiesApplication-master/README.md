# Enterprise Property Booking & Management System 🏢

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A comprehensive, production-ready full-stack application for real estate listing management. This platform bridges high-security backend standards with a premium, responsive frontend experience, designed specifically for scalability and ease of deployment.

## 🏗️ Architecture & Technical Highlights

The system is engineered for professional-grade performance and maintainability:

- **Real-Time Infrastructure:** Built on **STOMP over WebSockets**, enabling zero-latency communication between users and agents via a persistent global chat system.
- **Property Audit Trail:** A sophisticated snapshot system that tracks property states. Agent edits on approved listings are snapshotted, allowing Admins to review changes and potentially revert to previous versions if an edit is rejected.
- **Search Intelligence:** 
  - **Automated Geocoding:** Deep integration with the **Google Maps Geocoding API** to automatically resolve coordinates from plain-text addresses.
  - **Places Integration:** Native Google Places Autocomplete implementation for standardized address entry.
- **Booking Intelligence:** Dynamic date-blocking logic ensures that calendars only show genuinely available slots, automatically calculated from backend booking ranges.
- **Advanced RBAC:** Strictly enforced role hierarchies (ADMIN, AGENT, USER) ensuring secure access to sensitive management dashboards.

## 🌟 Key Features

### 👑 Admin Empowerment
- **User Management:** Full control over user accounts, including role switching and agent verification.
- **Property Approval Workflow:** Dedicated queue for reviewing new and modified property listings with audit trail support.
- **Global Statistics:** Real-time dashboard view of platform activity (total users, active properties, booking counts).

### 💼 Agent Tools
- **Listing Lifecycle:** Create and manage rich property listings with multi-image support and main-image designation.
- **Booking Management:** Interface for confirming or rejecting user booking requests in real-time.
- **Presence Control:** Instantly toggle property availability to hide/show listings from public search.

### 👤 User Experience
- **Interactive Discovery:** Map-based search with custom price markers and detailed filtering.
- **Secure Authentication:** Verified email registration, JWT stateless sessions, and secure async password reset flows.
- **Ratings & Reviews:** Comprehensive feedback system with computed average ratings.

## 🎨 UI/UX Excellence

- **Premium Aesthetic:** Curated "Warm Beige" design system with professional dark mode support.
- **Micro-Animations:** Seamless transitions and hover effects using Tailwind CSS and Framer-inspired interactions.
- **Responsive Layouts:** Mobile-first architecture ensuring a flawless experience across all device types.

## 🛠️ Tech Stack

- **Backend:** Java 21, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA, H2/PostgreSQL, JavaMailSender.
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Hot Toast.
- **DevOps:** Docker, Docker Compose, Multi-stage builds.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Google Maps API Key
- Mailtrap Account (for testing email flows)

### Quick Start with Docker
1. Clone the repository and configure `.env` (use `.env.example` as a template).
2. Start the containerized stack:
   ```bash
   docker-compose up --build
   ```
3. Access the platforms:
   - **Frontend:** `http://localhost:80`
   - **Backend API:** `http://localhost:8080`

### Manual Development Setup
For local development without Docker, refer to the [Detailed Setup Guide](./ManagementProject/README.md).

## 🧪 Testing
The backend is covered by an extensive suite of integration tests:
```bash
cd ManagementProject
./mvnw test
```

---
*Developed by [Mario Borizovski](https://github.com/MarioBorizovski)*
