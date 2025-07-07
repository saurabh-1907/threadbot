# Threads Clone - Full-Stack Social Media Application

This project is a full-stack clone of the popular social media application "Threads". It aims to replicate core functionalities like user authentication, creating posts, interacting with posts (liking, commenting), following users, and real-time chat.

Built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), it also leverages **Socket.io** for real-time communication (e.g., chat, notifications) and **Chakra UI** for a modern and responsive user interface.

## ✨ Features

This application boasts a rich set of features, including:

*   **Authentication & Authorization:** Secure user registration and login using JWT (JSON Web Tokens).
*   **User Profiles:** View and update user profiles, including profile pictures and bios.
*   **Follow/Unfollow System:** Users can follow and unfollow other users to customize their feed.
*   **Suggested Users:** Recommends users to follow.
*   **Create & Manage Posts:**
    *   Users can create text-based posts.
    *   Support for including images in posts (via Cloudinary).
    *   Ability to delete their own posts.
*   **Post Interactions:**
    *   Like and unlike posts.
    *   Comment on posts.
*   **Real-time Chat:**
    *   One-on-one messaging between users.
    *   Support for sending images in chat messages.
    *   Real-time message delivery and updates using Socket.io.
    *   Display of seen/unseen status for messages.
*   **AI-Powered Chatbot (ThreadBot):**
    *   Integrated with Groq API (using the `qwen-2.5-32b` model) to provide intelligent and helpful responses.
    *   Accessible as a conversational partner within the chat system (Note: Specific UI/UX for invoking ThreadBot needs to be implemented/verified if not already present).
*   **Notifications:** Real-time notifications for new messages and possibly other interactions (powered by Socket.io, includes notification sounds).
*   **Dark/Light Mode:** Toggle between dark and light themes for user preference.
*   **Responsive Design:** The application is designed to be fully responsive across various devices (desktops, tablets, mobiles) using Chakra UI.
*   **Account Management:**
    *   Users can update their profile information.
    *   Option to "Freeze" account (a temporary deactivation).
*   **Deployment Ready:**
    *   Configured for easy deployment on platforms like Render or Vercel.
    *   Includes a scheduled cron job to periodically ping the deployed application, useful for keeping free-tier services active.

## 🚀 Installation

To get this project up and running on your local machine, follow these steps:

### Prerequisites

*   **Node.js:** Make sure you have Node.js installed (which includes npm). You can download it from [nodejs.org](https://nodejs.org/).
*   **Git:** You'll need Git to clone the repository. Download it from [git-scm.com](https://git-scm.com/).
*   **MongoDB:** A MongoDB instance is required. You can use a local installation or a cloud-based service like MongoDB Atlas.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder-name>
```
*(Replace `<repository-url>` with the actual URL and `<repository-folder-name>` with the name of the cloned directory, usually `threads-clone` or similar)*

### 2. Backend Setup

The backend is managed from the root project directory.

*   **Install Dependencies:**
    ```bash
    npm install
    ```
    This command will install all necessary dependencies for the backend listed in the root `package.json`.

*   **Create `.env` File:**
    Create a `.env` file in the root of the project directory. This file will store your environment variables. Copy the following and replace the placeholder values with your actual credentials:

    ```env
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>

    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>

    GROQ_API_KEY=<your_groq_api_key>
    ```
    *   `PORT`: The port on which the backend server will run (defaults to 5000).
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A strong, unique secret key for signing JSON Web Tokens.
    *   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Your Cloudinary credentials for image uploads.
    *   `GROQ_API_KEY`: Your API key from Groq for the ThreadBot functionality.

### 3. Frontend Setup

The frontend setup can be handled in two ways:

*   **Option A: As part of the project build (Recommended for simplicity if you plan to build immediately):**
    The root `package.json`'s `build` script handles installing frontend dependencies. If you run `npm run build` (see "Building for Production"), it will execute `npm install --prefix frontend` automatically.

*   **Option B: For Frontend Development:**
    If you want to run the frontend development server separately:
    1.  Navigate to the frontend directory:
        ```bash
        cd frontend
        ```
    2.  Install frontend dependencies:
        ```bash
        npm install
        ```
    3.  Navigate back to the root directory if needed:
        ```bash
        cd ..
        ```

## 💻 Running Locally

Once the installation is complete, you can run the application locally.

### 1. Running the Backend Server

Navigate to the root project directory.

*   **Development Mode:**
    To run the backend server with Nodemon (which automatically restarts the server on file changes):
    ```bash
    npm run dev
    ```
    The backend will typically be available at `http://localhost:<PORT>` (e.g., `http://localhost:5000` if `PORT` is 5000).

*   **Production Mode:**
    To run the backend server in a production-like environment (without Nodemon):
    ```bash
    npm start
    ```

### 2. Running the Frontend Development Server

For frontend development, you'll usually run the Vite development server, which offers features like Hot Module Replacement (HMR).

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend will usually be available at `http://localhost:5173` (Vite's default port, but check your terminal output for the exact URL). The frontend will make requests to the backend API (ensure your backend is running).

### Production Note

When the application is built for production (using `npm run build` in the root directory), the backend server (`server.js`) is configured to serve the static frontend files from the `frontend/dist` folder. In this scenario, you only need to run the backend server (`npm start` from the root), and it will handle both the API and serving the frontend application.

## 📂 Project Structure

The project is organized into two main directories: `backend` and `frontend`, along with configuration files in the root.

```
.
├── backend/                    # Node.js, Express.js, MongoDB backend
│   ├── controllers/            # Logic for handling API requests
│   ├── db/                     # MongoDB connection setup
│   ├── middlewares/            # Custom Express middlewares (e.g., auth)
│   ├── models/                 # Mongoose schemas for database models
│   ├── routes/                 # API route definitions
│   ├── socket/                 # Socket.io connection and event handling
│   ├── utils/                  # Utility functions (e.g., Groq API integration)
│   ├── cron/                   # Scheduled tasks (e.g., keep-alive job)
│   └── server.js               # Main backend server entry point
├── frontend/                   # React.js, Vite, Chakra UI frontend
│   ├── public/                 # Static assets (images, favicon)
│   ├── src/                    # Frontend source code
│   │   ├── assets/             # Local assets like sounds
│   │   ├── atoms/              # Recoil state management atoms
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # React context providers (e.g., SocketContext)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── pages/              # Top-level page components
│   │   ├── App.jsx             # Main React application component
│   │   ├── main.jsx            # React application entry point
│   │   └── index.css           # Global styles
│   ├── .eslintrc.cjs           # ESLint configuration
│   ├── index.html              # Main HTML template for Vite
│   ├── package.json            # Frontend dependencies and scripts
│   └── vite.config.js          # Vite configuration
├── .gitignore                  # Specifies intentionally untracked files
├── LICENSE                     # Project license
├── package.json                # Backend dependencies and main project scripts
└── README.md                   # This file
```

### Key Directories:

*   **`backend/`**: Contains all the server-side code.
    *   `controllers/`: Handles the business logic for each API endpoint.
    *   `models/`: Defines the Mongoose schemas for database collections (Users, Posts, Messages, Conversations).
    *   `routes/`: Defines the API endpoints and links them to controller functions.
    *   `server.js`: The entry point for the backend application, setting up Express, database connection, middlewares, and starting the server.
    *   `socket/socket.js`: Configures Socket.IO for real-time communication.
    *   `utils/groq.js`: Contains the logic for interacting with the Groq API for the ThreadBot.
    *   `cron/cron.js`: Defines cron jobs, such as the keep-alive service.

*   **`frontend/`**: Contains all the client-side React application code.
    *   `src/pages/`: Components that represent full views/pages of the application (e.g., HomePage, UserPage, ChatPage).
    *   `src/components/`: Smaller, reusable UI components used across different pages.
    *   `src/hooks/`: Custom React hooks to encapsulate reusable logic.
    *   `src/atoms/`: Recoil state atoms for global state management.
    *   `src/App.jsx`: The root component that sets up routing and layout.
    *   `src/main.jsx`: The entry point for the React application, rendering the `App` component.

## 🔗 API Endpoints Overview

The backend exposes RESTful APIs for various functionalities. All routes are prefixed with `/api`. Below is a summary of the main route groups:

*   **`/users` - User Authentication & Management:**
    *   `GET /users/profile/:query` - Get user profile by username or ID.
    *   `GET /users/suggested` - Get suggested users for the logged-in user (requires authentication).
    *   `POST /users/signup` - Register a new user.
    *   `POST /users/login` - Log in an existing user.
    *   `POST /users/logout` - Log out a user.
    *   `POST /users/follow/:id` - Follow or unfollow a user (requires authentication).
    *   `PUT /users/update/:id` - Update user profile (requires authentication).
    *   `PUT /users/freeze` - Freeze or unfreeze user account (requires authentication).

*   **`/posts` - Posts & Interactions:**
    *   `GET /posts/feed` - Get posts for the user's feed (requires authentication).
    *   `GET /posts/:id` - Get a specific post by its ID.
    *   `GET /posts/user/:username` - Get all posts by a specific user.
    *   `POST /posts/create` - Create a new post (requires authentication).
    *   `DELETE /posts/:id` - Delete a post (requires authentication, user must be owner).
    *   `PUT /posts/like/:id` - Like or unlike a post (requires authentication).
    *   `PUT /posts/reply/:id` - Add a comment/reply to a post (requires authentication).

*   **`/messages` - Real-time Messaging & Conversations:**
    *   `GET /messages/conversations` - Get all conversations for the logged-in user (requires authentication).
    *   `GET /messages/:otherUserId` - Get messages between the logged-in user and another specified user (requires authentication).
    *   `POST /messages` - Send a message (requires authentication). Body should include `recipientId` and `message`.

*(Note: This is not an exhaustive list of all request/response bodies but provides a general overview. Routes marked with "requires authentication" use the `protectRoute` middleware. Refer to the route files in `backend/routes/` and controller files in `backend/controllers/` for detailed implementation.)*

## 📦 Building for Production

To create a production-ready build of the application, you can use the script provided in the root `package.json` file.

1.  **Ensure all dependencies are installed:**
    If you haven't already, run `npm install` in the root directory to install backend dependencies. The build script will handle frontend dependencies.

2.  **Run the build script:**
    From the root project directory, execute:
    ```bash
    npm run build
    ```
    This command performs the following actions:
    *   Installs all backend dependencies (effectively running `npm install` in the root, though it's good practice to do it beforehand).
    *   Installs all frontend dependencies by running `npm install --prefix frontend`.
    *   Creates an optimized production build of the frontend application by running `npm run build --prefix frontend`. The output will be placed in the `frontend/dist` directory.

After a successful build:
*   The `frontend/dist` directory will contain the static assets (HTML, CSS, JavaScript bundles) for your frontend.
*   The backend server (when run using `npm start`) is configured to serve these static assets from `frontend/dist`. This means you can deploy the entire application (backend and frontend) as a single unit.

## 🚀 Deployment

This MERN stack application is designed to be deployable on various cloud platforms that support Node.js.

### General Steps for Deployment:

1.  **Choose a Hosting Platform:**
    Popular choices include:
    *   **Render:** Good for full-stack applications, offers free tiers for Node.js services and databases.
    *   **Vercel:** Excellent for frontend hosting, can also host Node.js serverless functions. For a monolithic Express backend, other platforms might be more straightforward.
    *   **Heroku (Paid):** A long-standing PaaS provider.
    *   **AWS, Google Cloud, Azure:** Offer more comprehensive cloud services but can have a steeper learning curve.

2.  **Prepare your Application:**
    *   Ensure your `.env` file variables are set as environment variables on your hosting platform. **Do not commit your `.env` file to Git.**
    *   The `start` script in the root `package.json` (`cross-env NODE_ENV=production node backend/server.js`) is typically used by hosting platforms to run your application in production mode.
    *   The `build` script (`npm run build`) should be configured to run as part of your deployment process on the hosting platform. This ensures frontend assets are built and backend dependencies are installed.

3.  **Database:**
    *   Set up a production MongoDB database (e.g., MongoDB Atlas free tier).
    *   Ensure your `MONGO_URI` environment variable on the hosting platform points to this production database.

4.  **Configure Build and Start Commands on Platform:**
    *   **Build Command:** Typically `npm run build` (from the root).
    *   **Start Command:** Typically `npm start` (from the root).

### Example for Render:

*   Create a new "Web Service" on Render.
*   Connect your Git repository.
*   Set the **Build Command** to `npm run build`.
*   Set the **Start Command** to `npm start`.
*   Add your environment variables (from your `.env` file) in the Render dashboard.
*   Render will automatically install dependencies, run the build script, and then the start script.

### Keeping the Application Alive (Cron Job)

This project includes a cron job defined in `backend/cron/cron.js`.
*   **Purpose:** The cron job is configured to send a GET request to a specified URL (e.g., your deployed application's URL) every 14 minutes.
*   **Benefit:** This is particularly useful for applications deployed on free tiers of services like Render, which might "sleep" or spin down inactive applications to save resources. The periodic ping from the cron job helps keep the application instance awake and responsive.
*   **Configuration:** The cron job starts automatically when the backend server starts (`job.start()` in `backend/server.js`). You should update the `URL` constant in `backend/cron/cron.js` to point to your live application's URL after deployment if you intend to use this feature.

### Frontend-Only Deployment (Alternative)

While the project is set up for integrated deployment, you could also deploy the frontend separately (e.g., on Vercel or Netlify) and the backend on another platform (e.g., Render). In this case:
*   Build the frontend: `cd frontend && npm run build`.
*   Deploy the `frontend/dist` directory.
*   Configure the frontend to point to your deployed backend API URL (usually by setting an environment variable like `VITE_API_BASE_URL` and using it in your frontend code when making API calls).

---
