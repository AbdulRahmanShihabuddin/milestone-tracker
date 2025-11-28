# MilestoneTrack

A secure, full-stack web application for tracking compliance milestones with JWT authentication, REST APIs, and interactive dashboards.

## Features

- 🔐 **Secure Authentication**: JWT-based user registration and login
- 📊 **Interactive Dashboard**: Real-time statistics and progress visualization
- 📈 **Data Visualization**: Charts showing milestone distribution and progress
- ✅ **Milestone Management**: Create, read, update, and delete milestones
- 🎨 **Modern UI**: Premium dark theme with glassmorphism effects
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **File-based storage** (easily upgradeable to database)

### Frontend
- **React** with Vite
- **Chart.js** for data visualization
- **Axios** for API calls
- **Vanilla CSS** with modern design system

## Project Structure

```
milestonetrack/
├── backend/
│   ├── data/                  # Data storage (auto-generated)
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   └── milestones.js     # Milestone CRUD endpoints
│   ├── utils/
│   │   └── dataStore.js      # Data persistence layer
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Express server
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx      # Main dashboard
    │   │   ├── Login.jsx          # Authentication UI
    │   │   ├── MilestoneForm.jsx  # Create/edit form
    │   │   ├── MilestoneList.jsx  # Milestone list view
    │   │   └── ProgressChart.jsx  # Chart visualizations
    │   ├── utils/
    │   │   └── api.js            # API client with interceptors
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Design system
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server** (in the `backend` directory)
```bash
npm start
```
The server will run on `http://localhost:5000`

2. **Start the frontend dev server** (in the `frontend` directory)
```bash
npm run dev
```
The app will open automatically at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Milestone Endpoints

All milestone endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Get All Milestones
```http
GET /api/milestones
Authorization: Bearer <token>
```

#### Create Milestone
```http
POST /api/milestones
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete security audit",
  "description": "Perform comprehensive security review",
  "status": "pending",
  "category": "security",
  "dueDate": "2025-12-31"
}
```

#### Update Milestone
```http
PUT /api/milestones/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Milestone
```http
DELETE /api/milestones/:id
Authorization: Bearer <token>
```

## Configuration

### Backend Environment Variables

Edit `backend/.env` to configure:

```env
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**Important**: Change `JWT_SECRET` to a secure random string in production!

## Features in Detail

### Authentication
- Secure password hashing with bcrypt
- JWT tokens with configurable expiration
- Automatic token refresh handling
- Protected routes with middleware

### Milestone Management
- Create milestones with title, description, status, category, and due date
- Update milestone status (pending → in-progress → completed)
- Delete milestones with confirmation
- Sort milestones by status priority

### Dashboard
- Real-time statistics (total, completed, in-progress, pending)
- Completion rate percentage
- Status distribution doughnut chart
- Category breakdown bar chart
- Responsive grid layout

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses Node.js --watch flag for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot module replacement
```

### Building for Production
```bash
cd frontend
npm run build
```

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- CORS is configured for cross-origin requests
- Input validation on all endpoints
- Authorization checks ensure users can only access their own data

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Email notifications for due dates
- Team collaboration features
- File attachments for milestones
- Advanced filtering and search
- Export data to CSV/PDF
- Dark/light theme toggle

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
