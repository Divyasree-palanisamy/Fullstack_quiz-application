# Quiz Master

A simple quiz application built with Flask and MySQL. Users can register, take quizzes, and compete on the leaderboard.

## Features

- User registration and login
- Interactive quiz interface
- Real-time scoring and results
- Leaderboard with unique user tracking
- Responsive design with Bootstrap

## Setup

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up MySQL database:
   - Create database named "uo"
   - Run the SQL commands in `database_setup.sql`

3. Update database credentials in `app.py` if needed

4. Run the application:
   ```
   python app.py
   ```

## Usage

- Register a new account or login
- Take quizzes from the dashboard
- View your results and compare with others on the leaderboard
- Each user's best score is tracked for fair competition

## Tech Stack

- Backend: Flask (Python)
- Database: MySQL
- Frontend: HTML, CSS, JavaScript, Bootstrap
- Authentication: Session-based

## Project Structure

```
MERN_STACK/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── database_setup.sql  # Database schema
├── templates/          # HTML templates
├── static/            # CSS, JS, and assets
└── README.md          # This file
```

The app is ready to run after setting up the database and installing dependencies. 