# DevFlow 

DevFlow is a full-stack workflow management platform built for developers and teams to efficiently manage projects, track tasks, and collaborate in a streamlined environment.

🔗 **Live Demo:** https://dev-flow-lovat.vercel.app

---

##  Key Features

* **Project Management:** Create, update, and manage multiple projects.
* **Task Tracking:** Organize tasks with priorities (`High`, `Medium`, `Low`) and statuses (`To-Do`, `In Progress`, `Review`, `Done`).
* **Team Collaboration:** Assign tasks to team members and track ownership.
* **Authentication & Authorization:** Secure user registration and login using JWT.
* **Responsive Design:** Optimized experience across desktop, tablet, and mobile devices.
* **Deadline Management:** Set due dates and monitor project progress effectively.

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Token (JWT)
* Bcrypt.js

---

##  Technical Challenge & Solution

### Challenge: Building a Responsive Task Dashboard

**Problem:**
The task dashboard contains multiple pieces of information such as task title, status, priority, assigned user, deadlines, and action buttons. Displaying all of this data without cluttering the UI on smaller screens was challenging.

**Solution:**
Implemented a responsive layout using Tailwind CSS. Desktop users see a table-like structure for quick scanning, while mobile users get a card-based layout that improves readability and usability. Priority badges and action controls remain easily accessible without affecting the overall layout.

---

##  Getting Started

### Prerequisites

* Node.js (v16 or higher)
* MongoDB Atlas account or local MongoDB instance

---

### 1. Clone the Repository

```bash
git clone https://github.com/Pratham-3191/DevFlow.git
cd DevFlow
```

---

### 2. Backend Setup

Navigate to the API folder:

```bash
cd api
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Install dependencies and start the backend server:

```bash
npm install
npm run dev
```

---

### 3. Frontend Setup

Open a new terminal and navigate to the client folder:

```bash
cd client
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Install dependencies and start the frontend application:

```bash
npm install
npm run dev
```

---

### 4. Run the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

##  Project Structure

```text
DevFlow/
│
├── client/          # React Frontend
│
├── api/             # Express Backend
│
└── README.md
```

---

##  Key Engineering Takeaways

Building DevFlow strengthened my understanding of:

* **Full-Stack Development:** Building and connecting React frontend applications with Express APIs.
* **Authentication Systems:** Implementing JWT-based authentication and route protection.
* **Database Design:** Structuring MongoDB collections and Mongoose schemas efficiently.
* **State Management:** Managing authenticated user state and application data.
* **Responsive UI Development:** Creating mobile-friendly interfaces using Tailwind CSS.
* **REST API Development:** Designing scalable CRUD operations and secure endpoints.

---

##  Author

**Pratham Chaudhari**

* GitHub: https://github.com/Pratham-3191
* LinkedIn: https://www.linkedin.com/in/pratham-chaudhari-9237a0288

---

##  License

This project is licensed under the MIT License.
