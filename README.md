# Project Management System

A full-stack project management application built with React (Frontend) and Django (Backend), created by [@aswiinnnnn](https://github.com/aswiinnnnn).  
This app allows you to manage projects, employees, and project managers effectively.

## Features

- Create, read, update, and delete projects
- Manage employees and project managers
- Track project status (Not Started, Started, Completed, Opted Out)
- Assign employees to projects
- Assign project managers to projects
- Track project start and end dates

## Tech Stack

### Frontend
- React
- Vite
- Axios for API calls
- Modern React Hooks and Components

### Backend
- Django
- Django REST Framework
- SQLite (Development) / PostgreSQL (Production)
- CORS support

## Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git

## Project Setup

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Navigate to the backend directory:
```bash
cd backend
```

3. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r api/requirements.txt
```

5. Create a `.env` file in the backend directory with the following content:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Create a superuser to access the admin interface:
```bash
python manage.py createsuperuser
```
Follow the prompts to create your admin username, email, and password. You'll use these credentials to access the Django admin interface at http://127.0.0.1:8000/admin/

8. Initial Data Setup (Required):
   - Access the admin panel at http://127.0.0.1:8000/admin/
   - Log in with your superuser credentials
   - First, create at least one Project Manager:
     - Click on "Project Managers" under the API section
     - Click "Add Project Manager"
     - Enter the manager's name and save
   - Then, create some Employees:
     - Click on "Employees" under the API section
     - Click "Add Employee"
     - Enter the employee's name and save
   - These initial records are required because:
     - Project creation requires at least one Project Manager
     - Projects can be assigned to Employees
     - Without these records, you won't be able to create projects through the frontend

9. Start the backend server:
```bash
python manage.py runserver
```
The backend will run on http://127.0.0.1:8000/

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://127.0.0.1:8000
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```
The frontend will run on http://localhost:3000

## Project Structure

```
project/
├── backend/
│   ├── api/
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API views
│   │   ├── urls.py        # API endpoints
│   │   └── serializer.py  # Data serializers
│   ├── crud/
│   │   ├── settings.py    # Django settings
│   │   └── urls.py        # Main URL configuration
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── App.jsx        # Main App component
    │   └── main.jsx       # Entry point
    └── package.json
    
```

## API Endpoints

- Projects: `/api/projects/`
- Project Managers: `/api/projectsmanager/`
- Employees: `/api/employees/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Considerations

- Never commit `.env` files
- Keep your secret key secure
- Use environment variables for sensitive information
- In production, set DEBUG=False
- Use HTTPS in production
- Implement proper authentication before deploying

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the repository.
