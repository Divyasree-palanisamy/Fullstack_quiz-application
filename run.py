#!/usr/bin/env python3
"""
Quiz Master - Run Script
Simple script to start the Flask application
"""

import os
import sys

if __name__ == '__main__':
    print("🚀 Starting Quiz Master...")
    print("📱 Application will be available at: http://localhost:5000")
    print("🛑 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Import and run the Flask app directly
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Quiz Master stopped. Goodbye!")
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Make sure all dependencies are installed: pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Error starting Quiz Master: {e}")
        print("💡 Make sure MySQL server is running and database 'uo' exists") 