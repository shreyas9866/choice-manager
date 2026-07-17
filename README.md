🧠 RL Choice Manager

Live Demo: choice-manager.vercel.app

A full-stack, monetizable SaaS application that bridges the gap between complex machine learning algorithms and intuitive user interfaces. RL Choice Manager replaces standard collaborative filtering with a dynamic Reinforcement Learning engine to help users make optimal, data-driven decisions based on real-time environmental contexts.

✨ Key Features

Contextual Bandit Algorithm: Uses a dynamic dictionary of Q-Values based on the current Context (e.g., Weather, Time of Day, Mood) to actively learn user preferences and mathematically adjust win probabilities using the Softmax function.

Epsilon-Greedy Strategy: Balances decision-making by utilizing an 85% Exploitation (trusting the highest Q-Value) and 15% Exploration (randomized discovery) split to prevent users from getting stuck in algorithmic filter bubbles.

Global Hive Mind Analytics: Backend aggregation pipelines combine Q-Values across the entire database to visualize collective decision-making trends via interactive Recharts.

Secure Architecture: Fully implemented JWT (JSON Web Token) authentication for secure user sessions.

Monetization Ready: Cryptographically secure payment gateway integration using the Razorpay API.

Mobile Responsive: Custom CSS media queries ensure a flawless, app-like experience on any device size.

🛠️ Technology Stack

Frontend:

React.js (Vite)

Context API for Global State Management

Recharts for data visualization

Custom CSS (Mobile-First Responsive Design)

Backend:

Node.js & Express.js

MongoDB Atlas (Mongoose)

JWT Authentication

Razorpay API

DevOps & Deployment:

Docker (Backend containerization)

Vercel (Frontend edge deployment)

Render (Backend hosting)

🚀 Local Development Setup

Want to run the RL engine locally? Follow these steps:

Prerequisites

Node.js (v18+)

Docker Desktop (Optional, for backend containerization)

MongoDB Atlas Account (or local MongoDB instance)

1. Clone the repository

git clone https://github.com/shreyas9866/choice-manager.git
cd choice-manager


2. Environment Variables

You will need to create a .env file in the server directory with the following keys:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret


3. Run the Backend (using Docker)

Navigate to the server directory and build/run the isolated container:

cd server
docker build -t rl-backend .
docker run -p 5000:5000 --env-file .env rl-backend


(Alternatively, you can run npm install and npm start without Docker).

4. Run the Frontend

Open a new terminal, navigate to the client directory, install dependencies, and start Vite:

cd client
npm install
npm run dev


The application will be running at http://localhost:5173.

👨‍💻 Author

Shreyas
Full-Stack Engineer & Creator
Passionate about scalable backend architecture, interactive data visualization, and building secure, production-ready web applications.