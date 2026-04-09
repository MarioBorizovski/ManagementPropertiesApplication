# PropManager 🏠
### Enterprise Property Booking Management System

A full-stack web application for managing property listings and bookings, built with **Spring Boot** and **React**.

![Java](https://img.shields.io/badge/Java-17+-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue) ![JWT](https://img.shields.io/badge/Auth-JWT-yellow)

---

## Features

### Role-Based Access Control
Three roles with distinct permissions:

| Feature | Admin | Agent | User |
|---|---|---|---|
| View properties | ✅ | ✅ | ✅ |
| Create property | ✅ | ✅ | ❌ |
| Edit/delete property | ✅ | Own only | ❌ |
| Book property | ❌ | ❌ | ✅ |
| Confirm/reject booking | ✅ | Own properties | ❌ |
| Cancel booking | ✅ | ✅ | Own only |
| Manage all users | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ |

### Properties
- Search and filter by city, type, price range, and minimum bedrooms
- Property types: `APARTMENT`, `HOUSE`, `VILLA`, `OFFICE`
- Toggle availability on/off
- Agent-specific listings dashboard
- Pagination on all listing endpoints

### Bookings
- Full booking lifecycle: `PENDING` → `CONFIRMED` / `REJECTED` / `CANCELLED`
- Automatic date conflict detection — prevents double bookings
- Guest count validation against property maximum
- Special requests field

### Auth & Security
- JWT-based stateless authentication
- BCrypt password hashing
- Role-based method-level security (`@PreAuthorize`)
- Protected routes on the frontend

### Admin Dashboard
- Overview of total users, properties, and bookings
- Manage all users — change roles, delete accounts
- View and delete all bookings
- View all properties across agents

### Agent Dashboard
- Manage own property listings
- View and action bookings for own properties (confirm/reject)

---

## Tech Stack

**Backend**
- Java 17 + Spring Boot 3
- Spring Security + JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Lombok + Maven

**Frontend**
- React 18 + Vite
- React Router DOM 6
- Axios
- Tailwind CSS
- Lucide React + React Hot Toast

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.x

### 1. Database Setup
```sql
CREATE DATABASE property_management_db;
```

### 2. Backend Configuration
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/property_management_db
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update

app:
  jwt:
    secret: your_jwt_secret_key
    expiration: 86400000
```

### 3. Run the Backend
```bash
./mvnw spring-boot:run
```
API starts on `http://localhost:8080`

> On first startup, the `DataSeeder` automatically creates roles (`ROLE_ADMIN`, `ROLE_AGENT`, `ROLE_USER`) and a default Super Admin account.

### 4. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
App available at `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/me` | Authenticated | Get own profile |
| PUT | `/api/users/me` | Authenticated | Update own profile |
| DELETE | `/api/users/{id}` | Admin | Delete user |
| PATCH | `/api/users/{id}/role` | Admin | Change user role |

### Properties
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/properties` | Authenticated | Search/filter (paginated) |
| GET | `/api/properties/{id}` | Authenticated | Get by ID |
| POST | `/api/properties` | Admin/Agent | Create property |
| PUT | `/api/properties/{id}` | Admin/Agent | Update property |
| DELETE | `/api/properties/{id}` | Admin/Agent | Delete property |
| PATCH | `/api/properties/{id}/availability` | Admin/Agent | Toggle availability |
| GET | `/api/properties/my-listings` | Admin/Agent | Own listings |

**Query Parameters for GET `/api/properties`:**
- `city` — filter by city (partial match)
- `type` — filter by type (`APARTMENT`, `HOUSE`, `VILLA`, `OFFICE`)
- `minPrice` / `maxPrice` — price range per night
- `minBedrooms` — minimum bedroom count
- `page` / `size` — pagination

### Bookings
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/bookings` | Admin | All bookings (paginated) |
| GET | `/api/bookings/my-bookings` | Authenticated | Own bookings |
| GET | `/api/bookings/{id}` | Owner/Agent/Admin | Get by ID |
| POST | `/api/bookings` | User | Create booking |
| PATCH | `/api/bookings/{id}/cancel` | Owner/Admin | Cancel |
| PATCH | `/api/bookings/{id}/confirm` | Agent/Admin | Confirm |
| PATCH | `/api/bookings/{id}/reject` | Agent/Admin | Reject |
| DELETE | `/api/bookings/{id}` | Admin | Delete |

---

## Database Schema

```
users         — id, first_name, last_name, email, password, phone, role_id, active, created_at
roles         — id, name
properties    — id, title, description, address, city, country, type, price_per_night,
                bedrooms, bathrooms, max_guests, available, agent_id, created_at
bookings      — id, property_id, user_id, check_in_date, check_out_date, guests,
                total_price, special_requests, status, created_at
```

---

## Project Structure

```
ManagementProject/
├── src/main/java/org/example/managementproject/
│   ├── config/          # Security config, JWT, DataSeeder
│   ├── controller/      # REST controllers
│   ├── dto/             # Request & Response DTOs
│   ├── model/           # JPA entities
│   ├── repository/      # Spring Data JPA repositories
│   ├── security/        # JWT filter & utilities
│   └── service/         # Business logic
├── src/main/resources/
│   └── application.yml
└── frontend/
    ├── src/
    │   ├── api/         # Axios config & service functions
    │   ├── components/  # Navbar, ProtectedRoute
    │   ├── context/     # AuthContext
    │   └── pages/       # AdminDashboard, Properties, MyBookings, etc.
    └── package.json
```

---

## License
MIT
