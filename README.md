# 🏢 Premium Property Booking & Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## ✨ The Vision
In the world of real estate, trust and speed are everything. I built this platform to bridge the gap between a **rock-solid enterprise backend** and a **premium, fluid frontend**. It's not just a listing site; it's a complete ecosystem designed to handle everything from the first property "hello" to the final booking confirmation—all in real-time.

> [!NOTE]
> This project was developed by **Mario Borizovski** to showcase a modern approach to full-stack architecture, emphasizing high-security standards, real-time messaging, and intelligent data management.

---

## 📖 The Story Behind the Project
When I started this project, I noticed a common pattern in property management: data often feels static, and approvals feel slow. I wanted to solve that. 

I implemented a **Real-Time Synchronous Messaging** system using WebSockets so that users and agents never have to refresh their screens to talk. I also built a custom **Property Audit System**—if an agent edits a listing, the system captures a state "snapshot." This means a property never stays in a "broken" state; if an edit is rejected, it seamlessly reverts to its last known good version. It's about building a system that is as resilient as it is beautiful.

---

## 🌟 Core Pillars & Features

### 📡 Real-Time Heartbeat (WebSockets)
- **Zero-Latency Chat:** Built on the **STOMP protocol over WebSockets**, providing a global, persistent chat experience.
- **Instant Alerts:** Get notified the second a booking is confirmed or a message arrives, without the "refresh" fatigue.

### 🛡️ Intelligent Audit & Approval Logic
- **Snapshot Resilience:** Every approved listing is backed by a snapshot. If updates are rejected by an admin, the system automatically restores the previous state.
- **Role-Based Workflows:** Distinct, secure dashboards for **Admins**, **Agents**, and **Users**, each tailored to their specific needs.

### 🗺️ Map-Driven Discovery
- **Geocoding Intelligence:** Deep integration with **Google Maps REST APIs**. Users enter an address, and the system automatically resolves Latitude/Longitude for map placement.
- **Interactive Search:** Browse listings on a dynamic map with custom price markers and instant property previews.

### 📧 Automated Communications
- **Asynchronous Workflows:** Using `JavaMailSender` and async execution, the system handles registration, password resets, and approval alerts without slowing down the user experience.

---

## 🎨 Design Aesthetic
We believe high-quality code deserves a high-quality interface.
- **The "Warm Beige" Theme:** A curated design system that feels premium and inviting.
- **Full Dark Mode:** A meticulously crafted dark theme for those who prefer working late.
- **Fluid Interactions:** Smooth transitions and micro-animations powered by **Tailwind CSS** and Framer-inspired logic.

---

## 🛠️ The Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.2.2, Spring Security (JWT), Spring Data JPA |
| **Database** | PostgreSQL 16 / H2 (for tests) |
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, Lucide Icons |
| **Messaging** | STOMP over WebSockets (SockJS) |
| **DevOps** | Docker, Docker Compose (Multi-stage builds) |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |

---

## 🚀 Getting Started

### 🐳 The Quickest Way (Docker)
1. Clone the repository and create a `.env` file (copy from `.env.example`).
2. Run the magic command:
   ```bash
   docker-compose up --build
   ```
3. Open your browser:
   - **App:** `http://localhost:80`
   - **API Docs:** `http://localhost:8080`
   - **Default Admin:** `admin@gmail.com` / `admin` (auto-populated by `DataSeeder`)

### 🏗️ Manual Local Setup
If you prefer running it outside of Docker:

**1. Prerequisites:** Java 21, Node.js 18+, PostgreSQL.
**2. Database:** Create `property_management_db`.
**3. Backend:**
   ```bash
   cd ManagementProject
   ./mvnw spring-boot:run
   ```
**4. Frontend:**
   ```bash
   cd ManagementProject/frontend
   npm install
   npm run dev
   ```

---

## 🧪 Quality Assurance
The codebase is verified with professional-grade integration tests ensuring that the multi-role security and booking logic remain bulletproof.
```bash
cd ManagementProject
./mvnw test
```

---

## 🤝 Let's Connect
I'm always open to discussing architecture, full-stack patterns, or potential collaborations.

- **Developer:** Mario Borizovski
- **GitHub:** [MarioBorizovski](https://github.com/MarioBorizovski)
- **Project Goal:** Showcasing production-ready Full-Stack Engineering.

---
*Built with ❤️ and a lot of Java.*
