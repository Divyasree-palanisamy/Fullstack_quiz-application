# Deploy Your Flask Quiz App to Render (MySQL Version)

## Prerequisites
1. **GitHub Account** - Your code must be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MySQL Database** - You'll need a MySQL database (we'll use external MySQL)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Set Up MySQL Database

You have several options for MySQL database:

### Option A: Use PlanetScale (Recommended - Free)
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up and create a new database
3. Get your connection string

### Option B: Use Railway MySQL
1. Go to [railway.app](https://railway.app)
2. Create a new MySQL database
3. Get connection details

### Option C: Use Your Local MySQL (Not Recommended for Production)
- Keep using your local MySQL Workbench
- Make sure it's accessible from the internet

## Step 3: Deploy Your Web Service on Render

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**

### Basic Settings:
- **Name:** `quiz-app`
- **Environment:** `Python 3`
- **Region:** Choose closest to you
- **Branch:** `main`

### Build & Deploy Settings:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn app:app`

### Environment Variables:
Add these environment variables (replace with your actual database details):

```
SECRET_KEY=your_super_secret_key_here
FLASK_ENV=production
DB_HOST=your_mysql_host
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=uo
```

5. **Click "Create Web Service"**

## Step 4: Monitor Deployment

1. **Watch the build logs** - This will show you if there are any issues
2. **Wait for deployment** - Usually takes 2-5 minutes
3. **Check the URL** - Render will give you a URL like `https://your-app-name.onrender.com`

## Step 5: Test Your App

1. **Visit your app URL**
2. **Test registration and login**
3. **Take a quiz**
4. **Check leaderboard**

## How to Access Your Backend

### 1. View Application Logs:
- Go to your web service in Render dashboard
- Click on "Logs" tab
- Check "Build Logs" and "Live Logs"

### 2. Access Your Database:
- **If using PlanetScale:** Use their web interface
- **If using Railway:** Use their database viewer
- **If using local MySQL:** Use MySQL Workbench

### 3. API Endpoints:
Your app will be available at:
- Home: `https://your-app.onrender.com/`
- Login: `https://your-app.onrender.com/login`
- Dashboard: `https://your-app.onrender.com/dashboard`
- Quiz: `https://your-app.onrender.com/quiz`
- Leaderboard: `https://your-app.onrender.com/leaderboard`

### 4. Database Management:
- **PlanetScale:** Built-in web interface
- **Railway:** Built-in database viewer
- **Local MySQL:** Continue using MySQL Workbench

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check environment variables in Render
   - Ensure database is accessible from internet
   - Verify connection string

2. **Build Fails:**
   - Check requirements.txt
   - Ensure all dependencies are listed
   - Check Python version compatibility

3. **App Crashes:**
   - Check logs in Render dashboard
   - Verify gunicorn command
   - Check for import errors

### How to View Logs:
1. Go to your web service in Render
2. Click on "Logs" tab
3. Check "Build Logs" and "Live Logs"

## Cost
- **Render Free Tier:** 750 hours/month (enough for personal projects)
- **PlanetScale Free Tier:** 1 database, 1 billion reads/month
- **Railway Free Tier:** $5 credit monthly

## Next Steps
1. **Custom Domain:** Add your own domain in Render settings
2. **SSL Certificate:** Automatically provided by Render
3. **Auto-deploy:** Every push to main branch triggers deployment
4. **Monitoring:** Set up alerts for downtime

Your app will be live and accessible from anywhere in the world! 🌍 