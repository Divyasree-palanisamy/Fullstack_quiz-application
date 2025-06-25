# Fullstack Quiz Application

Designed and developed a dynamic and responsive Fullstack Quiz Application using Python, Flask, and SQLite for the backend, and vanilla JavaScript, HTML, and CSS for the frontend. This application allows users to test their knowledge with interactive and timed quizzes, track their scores, and view their rankings on a leaderboard. It features a modern, user-friendly interface with engaging animations and a seamless user experience.

## ✨ Key Features

- **User Authentication**: Secure user registration and login system with session management.
- **Interactive Quiz Interface**: A modern, engaging, and responsive quiz interface with real-time feedback.
- **Timed Quizzes**: Questions are timed to add a challenging element for users.
- **Dynamic Question Loading**: Questions are loaded dynamically from a JavaScript array.
- **Score & Results Tracking**: Users can view their scores, percentages, and time taken upon quiz completion.
- **Persistent Results**: Quiz results are saved to the database, tracking each user's performance over time.
- **Leaderboard**: A global leaderboard displays the top-performing users.
- **Modern Frontend**: Stylish and responsive UI built with Bootstrap and enhanced with custom CSS, featuring gradients, animations, and a professional look.

## 🛠️ Tech Stack

- **Backend**: Python, Flask
- **Database**: SQLite
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS Animations & Gradients
- **Authentication**: Flask-Session for server-side session management

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- `pip` for package installation

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Divyasree-palanisamy/Fullstack_quiz-application.git
    cd Fullstack_quiz-application
    ```

2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up the database:**
    The application is configured to use SQLite, which requires no special setup. The database file (`database.sql`) will be created automatically. To initialize the schema and add sample data, run:
    ```bash
    python database_setup.py
    python add_sample_data.py
    ```

4.  **Run the application:**
    ```bash
    python run.py
    ```
    The application will be available at `http://127.0.0.1:5000`.

## 📂 Project Structure

```
.
├── app.py              # Main Flask application logic
├── run.py              # Entry point to run the application
├── requirements.txt    # Python dependencies
├── database.sql        # SQLite database file (auto-generated)
├── database_setup.sql  # SQL schema for the database
├── add_sample_data.py  # Script to populate the database with sample data
├── templates/          # HTML templates for different pages
│   ├── base.html
│   ├── login.html
│   ├── register.html
│   └── ...
└── static/             # Static assets
    ├── css/style.css
    ├── js/quiz.js
    └── sounds/
```

The app is ready to run after setting up the database and installing dependencies. 