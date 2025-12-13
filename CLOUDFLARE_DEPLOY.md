# Deploy DevTools.site to Cloudflare Pages

Complete step-by-step guide to deploy your site on Cloudflare Pages.

## Prerequisites

- ✅ GitHub account
- ✅ Cloudflare account (free tier works)
- ✅ Node.js 18+ installed locally
- ✅ Your code pushed to GitHub

---

## Step 1: Push Code to GitHub

### 1.1 Initialize Git (if not done)

```bash
# Navigate to project directory
cd devtools-site

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: DevTools.site with voice assistant"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **+** icon → **New repository**
3. Repository name: `devtools-site` (or your preferred name)
4. Description: "Free online developer tools with voice assistant"
5. Set to **Public** (or Private if you prefer)
6. **DO NOT** check "Initialize with README" (we already have files)
7. Click **Create repository**

### 1.3 Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/devtools-site.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

**Note:** If you get authentication errors, use GitHub CLI or set up SSH keys.

---

## Step 2: Deploy to Cloudflare Pages

### 2.1 Access Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign in or create a free account
3. Click **Pages** in the left sidebar

### 2.2 Create New Project

1. Click **Create a project** button
2. Click **Connect to Git**
3. Authorize Cloudflare to access your GitHub account
4. Select your `devtools-site` repository
5. Click **Begin setup**

### 2.3 Configure Build Settings

Use these exact settings:

| Setting | Value |
|---------|-------|
| **Project name** | `devtools-site` |
| **Production branch** | `main` |
| **Framework preset** | `Astro` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave empty) |
| **Node version** | `18` (or latest) |

### 2.4 Environment Variables

**No environment variables needed** for basic deployment.

If you plan to add analytics later, you can add them here:
- `GA_MEASUREMENT_ID` (for Google Analytics)
- `ADSENSE_CLIENT_ID` (for AdSense)

### 2.5 Deploy

1. Click **Save and Deploy**
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://devtools-site.pages.dev` (or similar)

---

## Step 3: Add Custom Domain

### 3.1 Add Domain in Cloudflare Pages

1. In your Cloudflare Pages project, go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter your domain: `devtools.site` (or your domain)
4. Click **Continue**

### 3.2 Configure DNS

Cloudflare will show you DNS records to add:

**Option A: If your domain is already on Cloudflare**
- Cloudflare will automatically add the CNAME record
- Wait a few minutes for DNS propagation

**Option B: If your domain is elsewhere**
1. Go to your domain registrar's DNS settings
2. Add a CNAME record:
   - **Name**: `@` (or `www` for www subdomain)
   - **Target**: `devtools-site.pages.dev` (your Cloudflare Pages URL)
   - **TTL**: `3600` (or auto)

### 3.3 SSL Certificate

- Cloudflare automatically provisions SSL certificates
- Wait 5-10 minutes for certificate issuance
- Your site will be available at `https://devtools.site`

---

## Step 4: Update Site Configuration

### 4.1 Update astro.config.mjs

Make sure the `site` URL matches your domain:

```javascript
export default defineConfig({
  site: 'https://devtools.site', // Update this to your domain
  // ... rest of config
});
```

### 4.2 Commit and Push

```bash
git add astro.config.mjs
git commit -m "Update site URL for production"
git push
```

Cloudflare Pages will automatically rebuild and redeploy.

---

## Step 5: Verify Deployment

### 5.1 Test Your Site

1. Visit your live URL: `https://devtools.site`
2. Test key features:
   - ✅ Homepage loads
   - ✅ Tools work (try JSON Formatter)
   - ✅ Dark mode toggle works
   - ✅ Voice assistant works (click button, test voice)
   - ✅ Mobile responsive
   - ✅ Search works

### 5.2 Check Build Logs

1. Go to Cloudflare Pages dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click on latest deployment
5. Check **Build logs** for any errors

### 5.3 Performance Check

Run Lighthouse audit:
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run audit
4. Aim for scores > 90 in all categories

---

## Step 6: Continuous Deployment

Cloudflare Pages automatically deploys on every push to `main`:

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Cloudflare will automatically:
# 1. Detect the push
# 2. Build your site
# 3. Deploy to production
```

### Preview Deployments

For pull requests:
1. Create a branch: `git checkout -b feature/new-tool`
2. Make changes and push
3. Create a Pull Request on GitHub
4. Cloudflare will create a preview deployment
5. Test the preview before merging

---

## Troubleshooting

### Build Fails

**Error: "Build command failed"**
- Check build logs in Cloudflare dashboard
- Ensure `package.json` has all dependencies
- Verify Node.js version (should be 18+)
- Try building locally: `npm run build`

**Error: "Module not found"**
- Check all imports are correct
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Domain Not Working

**Error: "Domain not resolving"**
- Check DNS records are correct
- Wait 24-48 hours for DNS propagation
- Verify CNAME target is correct
- Check domain registrar settings

**Error: "SSL certificate pending"**
- Wait 5-10 minutes for certificate issuance
- Check Cloudflare SSL/TLS settings
- Ensure domain is proxied (orange cloud) in Cloudflare

### Voice Assistant Not Working

**Error: "Microphone permission denied"**
- HTTPS is required for Speech Recognition
- Check browser console for errors
- Test in Chrome/Edge (best support)
- Grant microphone permissions in browser

**Error: "Speech Recognition not supported"**
- Use Chrome, Edge, or Safari (iOS 14.5+)
- Firefox doesn't support Speech Recognition
- Check browser compatibility

### Performance Issues

**Slow page loads**
- Check Cloudflare cache settings
- Enable Cloudflare CDN
- Optimize images and assets
- Check build output size

---

## Advanced Configuration

### Custom Build Settings

If you need custom build settings:

1. Go to **Settings** → **Builds & deployments**
2. Click **Add build configuration**
3. Configure:
   - Environment variables
   - Build command overrides
   - Node version

### Analytics Integration

Add Cloudflare Web Analytics (free):

1. Go to **Settings** → **Analytics**
2. Enable **Cloudflare Web Analytics**
3. Add tracking code to `BaseLayout.astro`:

```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

### Custom Headers

Already configured in `public/_headers`:
- Security headers
- Cache control
- CORS settings

---

## Quick Reference

### Important URLs

- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Pages Dashboard**: https://dash.cloudflare.com → Pages
- **Your Site**: `https://devtools-site.pages.dev` (or your custom domain)

### Useful Commands

```bash
# Build locally
npm run build

# Preview production build
npm run preview

# Test development server
npm run dev

# Check for errors
npm run lint
```

### Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Community](https://community.cloudflare.com/)

---

## Checklist

Before going live, verify:

- [ ] Code pushed to GitHub
- [ ] Cloudflare Pages project created
- [ ] Build completes successfully
- [ ] Custom domain configured
- [ ] SSL certificate issued
- [ ] Site loads correctly
- [ ] All tools work
- [ ] Voice assistant works
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] SEO meta tags present
- [ ] Sitemap generated
- [ ] Analytics configured (optional)
- [ ] Performance optimized

---

## Success! 🎉

Your DevTools.site should now be live on Cloudflare Pages!

**Next Steps:**
1. Share your site URL
2. Monitor analytics
3. Add more tools
4. Collect user feedback
5. Optimize performance

---

## Need Help?

- Check Cloudflare Pages logs
- Review build output
- Test locally first
- Check browser console
- Verify all dependencies installed

Happy deploying! 🚀

