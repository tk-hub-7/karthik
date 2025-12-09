# Military Asset Management System

A comprehensive full-stack application for tracking military assets across multiple bases with role-based access control.

## 🚀 Technology Stack

- **Frontend**: React 18 + Vite + TailwindCSS
- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## ✨ Features

- 🔐 **Secure Authentication** with JWT tokens
- 👥 **Role-Based Access Control** (Admin, Base Commander, Logistics Officer)
- 📊 **Real-time Dashboard** with statistics and filters
- 🛒 **Purchase Management** with inventory auto-updates
- 🔄 **Transfer Tracking** between bases with status indicators
- 👤 **Personnel Assignments** with return tracking
- 📝 **Complete Audit Trail** via API logging
- 🎨 **Modern Dark Theme** UI with smooth animations
- 📱 **Fully Responsive** design for all devices

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
cd C:\Users\Karthik\Desktop\military
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=military_ams
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### Create PostgreSQL Database

```sql
CREATE DATABASE military_ams;
```

#### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser

```bash
python manage.py createsuperuser
```

#### Create Sample Data (Optional)

```bash
python manage.py shell
```

Then run:

```python
from django.contrib.auth.models import User
from assets.models import Base, EquipmentType, UserRole

# Create bases
base1 = Base.objects.create(name="Alpha Base", location="North Region", code="ALPHA-01")
base2 = Base.objects.create(name="Bravo Base", location="South Region", code="BRAVO-02")
base3 = Base.objects.create(name="Charlie Base", location="East Region", code="CHARLIE-03")

# Create equipment types
EquipmentType.objects.create(name="Rifles", description="Standard issue rifles", unit="units")
EquipmentType.objects.create(name="Ammunition", description="5.56mm rounds", unit="rounds")
EquipmentType.objects.create(name="Vehicles", description="Transport vehicles", unit="units")
EquipmentType.objects.create(name="Medical Supplies", description="First aid kits", unit="kits")
EquipmentType.objects.create(name="Communication Equipment", description="Radios and devices", unit="units")

# Create users with different roles
admin_user = User.objects.create_user(username='admin', password='admin123', email='admin@military.com', first_name='Admin', last_name='User')
UserRole.objects.create(user=admin_user, role='admin')

commander_user = User.objects.create_user(username='commander', password='commander123', email='commander@military.com', first_name='Base', last_name='Commander')
UserRole.objects.create(user=commander_user, role='base_commander', assigned_base=base1)

logistics_user = User.objects.create_user(username='logistics', password='logistics123', email='logistics@military.com', first_name='Logistics', last_name='Officer')
UserRole.objects.create(user=logistics_user, role='logistics_officer')

print("Sample data created successfully!")
```

#### Start Backend Server

```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## 👤 Default Login Credentials

After creating sample data, you can login with:

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Base Commander:**
- Username: `commander`
- Password: `commander123`

**Logistics Officer:**
- Username: `logistics`
- Password: `logistics123`

## 🎯 Usage Guide

### Dashboard
- View opening balance, closing balance, and net movement
- Apply filters by base, equipment type, and date range
- Click "Net Movement" card to see detailed breakdown

### Purchases
- Record new asset purchases
- Filter by base, equipment type, and date
- Automatically updates inventory

### Transfers
- Transfer assets between bases
- Track transfer status (Pending, In Transit, Completed)
- Filters for source/destination bases

### Assignments
- Assign assets to personnel
- Track assigned and returned quantities
- View outstanding assignments

## 🔐 Role-Based Access

### Admin
- Full access to all bases and operations
- Can create/modify bases and equipment types
- Complete system control

### Base Commander
- Access only to assigned base
- Can manage purchases, transfers, and assignments for their base
- Cannot access other bases

### Logistics Officer
- Access to all bases for purchases and transfers
- Read-only access to assignments
- Cannot modify base or equipment type configurations

## 📁 Project Structure

```
military/
├── backend/
│   ├── military_ams/          # Django project settings
│   ├── assets/                # Main app
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   ├── permissions.py    # RBAC permissions
│   │   ├── middleware.py     # API logging
│   │   └── urls.py           # API routes
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/              # API client
    │   ├── components/       # Reusable components
    │   ├── context/          # React context
    │   ├── pages/            # Page components
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/register/` - Register
- `POST /api/v1/auth/refresh/` - Refresh token

### Dashboard
- `GET /api/v1/dashboard/stats/` - Get statistics

### Resources
- `GET/POST /api/v1/bases/` - Bases
- `GET/POST /api/v1/equipment-types/` - Equipment types
- `GET /api/v1/inventory/` - Inventory
- `GET/POST /api/v1/purchases/` - Purchases
- `GET/POST /api/v1/transfers/` - Transfers
- `GET/POST /api/v1/assignments/` - Assignments
- `GET/POST /api/v1/expenditures/` - Expenditures

## 🎨 UI Features

- **Dark Theme**: Military-inspired color scheme
- **Smooth Animations**: Fade-in, slide-up effects
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Interactive Cards**: Hover effects and click interactions
- **Status Badges**: Color-coded status indicators
- **Modal Forms**: Clean popup forms for data entry
- **Loading States**: Skeleton screens and spinners

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📝 License

This project is for military use only.

## 👨‍💻 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Military Asset Management**
