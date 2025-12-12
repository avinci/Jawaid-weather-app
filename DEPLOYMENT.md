# Deployment Guide - Jawaid's Weather App

This guide covers deploying the weather app to Netlify.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://www.netlify.com/)
2. **WeatherAPI Key**: Get a free API key from [weatherapi.com](https://www.weatherapi.com/signup.aspx)
3. **Git Repository**: Code must be in GitHub, GitLab, or Bitbucket

## Step-by-Step Deployment

### 1. Prepare Repository

Ensure all changes are committed and pushed to your repository:

```bash
git status
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### 2. Connect to Netlify

1. Log in to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify to access your repositories
5. Select the `Jawaid-weather-app` repository

### 3. Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 20 (or leave blank to use default)

The `netlify.toml` file includes:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 4. Set Environment Variables

**Critical**: The app will not work without the API key!

1. In your Netlify site dashboard, go to **Site settings** → **Environment variables**
2. Click **"Add a variable"**
3. Add the following:
   - **Key**: `VITE_WEATHER_API_KEY`
   - **Value**: Your WeatherAPI.com API key
   - **Scopes**: Select all (Production, Deploy Previews, Branch Deploys)

4. **Save** the variable

### 5. Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy the `dist` folder

3. Wait for deployment to complete (usually 1-2 minutes)

### 6. Verify Deployment

Once deployed, Netlify will provide a URL like `https://your-site-name.netlify.app`

**Test the following:**

- [ ] Application loads without errors
- [ ] San Francisco weather loads automatically
- [ ] Search for a location (e.g., "New York")
- [ ] Toggle between Fahrenheit and Celsius
- [ ] Check 7-day forecast displays
- [ ] Check 24-hour forecast scrolls properly
- [ ] Open browser console - no errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)

### 7. Custom Domain (Optional)

To use a custom domain:

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow Netlify's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

## Post-Deployment Checklist

- [ ] Site accessible via Netlify URL
- [ ] All user stories work correctly
- [ ] No console errors
- [ ] Performance is acceptable (load time < 3 seconds)
- [ ] Temperature toggle works instantly
- [ ] Search returns results within 2 seconds
- [ ] Mobile view works (if applicable)
- [ ] Tested in Chrome, Firefox, Safari, Edge

## Troubleshooting

### Build Fails

**Error: "Command failed with exit code 1"**
- Check build logs in Netlify
- Verify `package.json` scripts are correct
- Ensure all dependencies are in `package.json` (not just `devDependencies`)

**Error: "Failed to compile TypeScript"**
- Run `npm run build` locally to reproduce
- Fix TypeScript errors
- Commit and push fixes

### App Loads But Shows Errors

**Error: "API key missing or invalid"**
- Verify environment variable is set correctly
- Key must be named exactly `VITE_WEATHER_API_KEY`
- Redeploy after adding environment variable

**Error: "Failed to fetch weather data"**
- Test API key at [weatherapi.com/my-account.aspx](https://www.weatherapi.com/my-account.aspx)
- Check API key usage hasn't exceeded free tier limit
- Verify API key is active

### Performance Issues

**Slow load times**
- Check Netlify's analytics for deployment size
- Bundle should be ~80 KB (uncompressed), ~30 KB (gzipped)
- Consider enabling Netlify's asset optimization

## Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Netlify will automatically build and deploy
```

**Deploy previews** are created for pull requests automatically.

## Monitoring

### Analytics

Enable Netlify Analytics (paid) to track:
- Page views
- Bandwidth usage
- Popular pages

### Error Monitoring

Consider adding:
- [Sentry](https://sentry.io/) for error tracking
- [Google Analytics](https://analytics.google.com/) for usage metrics

## Security Notes

⚠️ **API Key Exposure**: The API key is visible in client-side code. This is acceptable for:
- Personal projects
- Demo applications
- Free API tiers with usage limits

For production applications with sensitive data, consider:
- Implementing a backend proxy
- Using Netlify Functions to hide the API key
- Rate limiting on your backend

## Support

- **Netlify Documentation**: [docs.netlify.com](https://docs.netlify.com/)
- **Netlify Support**: [answers.netlify.com](https://answers.netlify.com/)
- **WeatherAPI Documentation**: [weatherapi.com/docs](https://www.weatherapi.com/docs/)

## Rollback

To rollback to a previous deployment:

1. Go to **Deploys** in Netlify dashboard
2. Find the deployment you want to restore
3. Click **"Publish deploy"**
4. Confirm the rollback

Netlify keeps all previous deployments for easy rollback.
