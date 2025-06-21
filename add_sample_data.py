#!/usr/bin/env python3
"""
Add Sample Data Script
This script adds sample users and quiz results to test the leaderboard functionality
"""

import mysql.connector
from mysql.connector import connect, Error
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta
import random

def get_db_connection():
    return connect(
        host="localhost",
        user="root",
        password="Divya@2004",
        database="uo"
    )

def add_sample_data():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Sample users
        sample_users = [
            ("john_doe", "john@example.com", "password123"),
            ("jane_smith", "jane@example.com", "password123"),
            ("mike_wilson", "mike@example.com", "password123"),
            ("sarah_jones", "sarah@example.com", "password123"),
            ("alex_brown", "alex@example.com", "password123")
        ]
        
        # Add users
        user_ids = []
        for username, email, password in sample_users:
            try:
                hashed_password = generate_password_hash(password)
                cursor.execute("""
                    INSERT INTO users (username, email, password_hash) 
                    VALUES (%s, %s, %s)
                """, (username, email, hashed_password))
                user_ids.append(cursor.lastrowid)
                print(f"✅ Added user: {username}")
            except Error as e:
                if "Duplicate entry" in str(e):
                    print(f"⚠️  User {username} already exists")
                    # Get existing user ID
                    cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
                    user = cursor.fetchone()
                    if user:
                        user_ids.append(user['id'])
                else:
                    print(f"❌ Error adding user {username}: {e}")
        
        connection.commit()
        
        # Sample quiz results
        quiz_types = ['general', 'programming', 'science', 'history']
        
        for user_id in user_ids:
            # Add 2-4 quiz results per user
            num_quizzes = random.randint(2, 4)
            for i in range(num_quizzes):
                score = random.randint(5, 10)  # Random score between 5-10
                total_questions = 10
                time_taken = random.randint(30, 120)  # Random time between 30-120 seconds
                quiz_type = random.choice(quiz_types)
                
                # Random date within last 30 days
                days_ago = random.randint(0, 30)
                completed_at = datetime.now() - timedelta(days=days_ago)
                
                cursor.execute("""
                    INSERT INTO quiz_results (user_id, score, total_questions, time_taken, quiz_type, completed_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (user_id, score, total_questions, time_taken, quiz_type, completed_at))
                
                print(f"✅ Added quiz result: User {user_id}, Score {score}/10, Time {time_taken}s")
        
        connection.commit()
        print("\n🎉 Sample data added successfully!")
        print("📊 You can now test the leaderboard functionality")
        
    except Error as e:
        print(f"❌ Error adding sample data: {e}")
        connection.rollback()
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    print("🚀 Adding sample data to Quiz Master database...")
    add_sample_data() 