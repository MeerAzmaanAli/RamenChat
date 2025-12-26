# Deploy RamenChat to Netlify

## Prerequisites
- GitHub account (or GitLab/Bitbucket)
- Netlify account (free tier works)
- Your project pushed to a Git repository

## Step 1: Push Your Code to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a repository on GitHub:**
   - Go to https://github.com/new
   - Create a new repository (e.g., "ramen-chat")
   - Don't initialize with README, .gitignore, or license

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ramen-chat.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Sign up/Login to Netlify:**
   - Go to https://app.netlify.com
   - Sign up or login (you can use GitHub to sign in)

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Click "Deploy with GitHub"
   - Authorize Netlify to access your GitHub account
   - Select your repository (ramen-chat)

3. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Base directory:** (leave empty)

4. **Set Environment Variables:**
   - Before deploying, click "Show advanced" → "New variable"
   - Add your Firebase API key:
     - **Key:** `VITE_API_KEY`
     - **Value:** (your Firebase API key from .env file)
   - Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize and deploy:**
   ```bash
   netlify init
   ```
   - Follow the prompts
   - Build command: `npm run build`
   - Publish directory: `dist`
   - No to Netlify functions

4. **Set environment variables:**
   ```bash
   netlify env:set VITE_API_KEY "your-api-key-here"
   ```

5. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

## Step 3: Post-Deployment Configuration

### 1. Update Firebase Allowed Domains

After deploying, you'll get a URL like `https://your-site-name.netlify.app`

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → **Authentication** → **Settings**
3. Under "Authorized domains", click "Add domain"
4. Add: `your-site-name.netlify.app`
5. Also add: `*.netlify.app` (for preview deployments)

### 2. Update Firebase Storage Rules (if needed)

Make sure your Storage rules allow access from your Netlify domain.

### 3. Test Your Deployment

Visit your Netlify URL and test:
- User registration
- User login
- Sending messages
- Image uploads

## Important Notes

### Environment Variables
- Never commit `.env` files (already in .gitignore)
- Always set environment variables in Netlify dashboard
- For Vite projects, prefix with `VITE_` (e.g., `VITE_API_KEY`)

### Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- Node version: Netlify uses Node 18 by default (you can specify in `netlify.toml` if needed)

### Firebase Configuration
- Your Firebase config is in `src/lib/firebase.js`
- It uses `import.meta.env.VITE_API_KEY` for the API key
- Make sure `VITE_API_KEY` is set in Netlify environment variables

### Continuous Deployment
- Netlify automatically deploys on every push to main branch
- Preview deployments are created for pull requests
- You can trigger manual deploys from the Netlify dashboard

## Troubleshooting

### Build Fails
- Check Netlify build logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Environment Variables Not Working
- Make sure variables are prefixed with `VITE_` for Vite
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

### Firebase Errors
- Verify Firebase project ID is correct
- Check authorized domains in Firebase Console
- Ensure Firestore rules allow your Netlify domain

### 404 Errors on Navigation
- This is common with SPAs (Single Page Applications)
- Netlify handles this automatically, but you can add a `_redirects` file if needed

## Optional: Custom Domain

1. In Netlify dashboard, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS configuration instructions
4. Update Firebase authorized domains with your custom domain

## Monitoring

- Check Netlify dashboard for:
  - Build status
  - Deploy logs
  - Function logs (if using Netlify Functions)
  - Analytics (available on paid plans)

