# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import connect, Error
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

# Database connection function
def get_db_connection():
    return connect(
        host="localhost",
        user="root",
        password="Divya@2004",
        database="uo"
    )

# Initialize database connection
conn = get_db_connection()
mycursor = conn.cursor(dictionary=True)

# Create tables if they don't exist
def create_tables():
    try:
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create quiz_results table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS quiz_results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                score INT NOT NULL,
                total_questions INT NOT NULL,
                time_taken INT NOT NULL,
                completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                quiz_type VARCHAR(50) DEFAULT 'general',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)
        
        conn.commit()
        print("Tables created successfully!")
        
    except Error as e:
        print(f"Error creating tables: {e}")
    finally:
        cursor.close()

# Routes
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        # Check if user already exists
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                flash('Username already exists!', 'error')
                return redirect(url_for('register'))
            
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            if cursor.fetchone():
                flash('Email already registered!', 'error')
                return redirect(url_for('register'))
            
            # Create new user
            hashed_password = generate_password_hash(password)
            cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", 
                          (username, email, hashed_password))
            connection.commit()
            
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
            
        except Error as e:
            print(f"Registration error: {e}")
            flash('Registration failed. Please try again.', 'error')
        finally:
            cursor.close()
            connection.close()
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        
        try:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            
            if isinstance(user, dict) and 'password_hash' in user and check_password_hash(user['password_hash'], password):
                session['user_id'] = user['id']
                session['username'] = user['username']
                flash('Login successful!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Invalid username or password!', 'error')
                
        except Error as e:
            print(f"Login error: {e}")
            flash('Login failed. Please try again.', 'error')
        finally:
            cursor.close()
            connection.close()
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('home'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Get user info
        cursor.execute("SELECT * FROM users WHERE id = %s", (session['user_id'],))
        user = cursor.fetchone()
        
        # Get recent quiz results
        cursor.execute("""
            SELECT * FROM quiz_results 
            WHERE user_id = %s 
            ORDER BY completed_at DESC 
            LIMIT 5
        """, (session['user_id'],))
        recent_results = cursor.fetchall()
        
        return render_template('dashboard.html', user=user, recent_results=recent_results)
        
    except Error as e:
        print(f"Dashboard error: {e}")
        flash('Error loading dashboard.', 'error')
        return redirect(url_for('home'))
    finally:
        cursor.close()
        connection.close()

@app.route('/quiz')
def quiz():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('quiz.html')

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    data = request.get_json()
    score = data.get('score', 0)
    total_questions = data.get('total_questions', 0)
    time_taken = data.get('time_taken', 0)
    quiz_type = data.get('quiz_type', 'general')
    
    connection = get_db_connection()
    cursor = connection.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO quiz_results (user_id, score, total_questions, time_taken, quiz_type)
            VALUES (%s, %s, %s, %s, %s)
        """, (session['user_id'], score, total_questions, time_taken, quiz_type))
        connection.commit()
        
        return jsonify({'success': True, 'message': 'Quiz result saved!'})
        
    except Error as e:
        print(f"Error saving quiz result: {e}")
        return jsonify({'error': 'Failed to save result'}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/results')
def results():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT * FROM quiz_results 
            WHERE user_id = %s 
            ORDER BY completed_at DESC
        """, (session['user_id'],))
        raw_results = cursor.fetchall()
        all_results = []
        for row in raw_results:
            if isinstance(row, dict):
                result = row
                ca = result.get('completed_at')
                if isinstance(ca, datetime):
                    result['completed_at'] = ca.strftime('%Y-%m-%d %H:%M')
                else:
                    result['completed_at'] = str(ca)[:16] if ca is not None else ''
                all_results.append(result)
            elif isinstance(row, tuple):
                # fallback: just append as-is if tuple
                all_results.append(row)
        return render_template('results.html', results=all_results)
    
    except Error as e:
        print(f"Results error: {e}")
        flash('Error loading results.', 'error')
        return redirect(url_for('dashboard'))
    finally:
        cursor.close()
        connection.close()

@app.route('/leaderboard')
def leaderboard():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        # Top 10 scores for podium and table
        cursor.execute("""
            SELECT u.username, 
                   qr.score, 
                   qr.total_questions, 
                   qr.completed_at
            FROM quiz_results qr
            JOIN users u ON qr.user_id = u.id
            ORDER BY (qr.score / qr.total_questions) DESC, qr.completed_at ASC
            LIMIT 10
        """)
        top_scores = cursor.fetchall()
        top_scores_list = []
        for score in top_scores:
            if isinstance(score, dict) and 'username' in score and 'score' in score and 'total_questions' in score and 'completed_at' in score:
                top_scores_list.append((
                    score['username'],
                    score['score'],
                    score['total_questions'],
                    score['completed_at']
                ))
        # Unique participants
        cursor.execute("SELECT COUNT(DISTINCT user_id) AS unique_participants FROM quiz_results")
        unique_row = cursor.fetchone()
        unique_participants = unique_row['unique_participants'] if isinstance(unique_row, dict) and 'unique_participants' in unique_row else 0
        # Average score (percentage)
        cursor.execute("SELECT SUM(score) AS total_score, SUM(total_questions) AS total_questions FROM quiz_results")
        row = cursor.fetchone()
        if isinstance(row, dict) and row.get('total_questions') and row['total_questions'] > 0:
            average_score = round((row['total_score'] / row['total_questions']) * 100, 1)
        else:
            average_score = 0
        # Highest score
        cursor.execute("SELECT MAX(score) AS highest_score FROM quiz_results")
        high_row = cursor.fetchone()
        highest_score = high_row['highest_score'] if isinstance(high_row, dict) and high_row['highest_score'] is not None else 0
        return render_template('leaderboard.html', top_scores=top_scores_list, unique_participants=unique_participants, average_score=average_score, highest_score=highest_score)
    except Error as e:
        print(f"Leaderboard error: {e}")
        flash('Error loading leaderboard.', 'error')
        return render_template('leaderboard.html', top_scores=[], unique_participants=0, average_score=0, highest_score=0)
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    # Create tables when the app starts
    create_tables()
    app.run(debug=True) 