# Deployment Guide - DevTools.site

This guide will walk you through deploying DevTools.site to Cloudflare Pages.

## Prerequisites

1. A GitHub account
2. A Cloudflare account (free tier works)
3. Node.js 18+ installed locally

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: DevTools.site"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `devtools-site` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/devtools-site.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Cloudflare Pages

### 2.1 Access Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**

### 2.2 Connect GitHub Repository

1. Click **Connect to Git**
2. Authorize Cloudflare to access your GitHub account
3. Select your `devtools-site` repository
4. Click **Begin setup**

### 2.3 Configure Build Settings

Use these settings:

- **Project name**: `devtools-site` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: `Astro`
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)

### 2.4 Environment Variables

No environment variables are required for basic deployment. If you plan to add analytics later, you can add them here.

### 2.5 Deploy

1. Click **Save and Deploy**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be available at `https://devtools-site.pages.dev` (or similar)

## Step 3: Add Custom Domain

### 3.1 Add Domain in Cloudflare Pages

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `devtools.site` (or your domain)
4. Click **Continue**

### 3.2 Configure DNS

Cloudflare will provide DNS records to add:

1. Go to your domain's DNS settings in Cloudflare
2. Add the CNAME record provided by Cloudflare Pages
3. Wait for DNS propagation (usually a few minutes)

### 3.3 SSL/TLS

Cloudflare automatically provisions SSL certificates. Wait a few minutes for the certificate to be issued.

## Step 4: Update Site Configuration

### 4.1 Update astro.config.mjs

Make sure the `site` URL in `astro.config.mjs` matches your domain:

```javascript
export default defineConfig({
  site: 'https://devtools.site', // Update this
  // ... rest of config
});
```

### 4.2 Rebuild and Redeploy

After updating the config:

1. Commit and push changes:
   ```bash
   git add astro.config.mjs
   git commit -m "Update site URL"
   git push
   ```

2. Cloudflare Pages will automatically rebuild

## Step 5: Test Voice Assistant

The voice assistant uses browser-native Web Speech API:
- **Speech Recognition**: Works in Chrome, Edge, Safari (iOS 14.5+)
- **Speech Synthesis**: Works in all modern browsers
- **No API keys required** - completely free and runs in browser

Test on mobile devices to ensure voice input works properly.

## Step 6: Add Analytics (Optional)

### 5.1 Cloudflare Analytics

Cloudflare Analytics is automatically available if you're using Cloudflare for DNS.

### 5.2 Google Analytics 4

1. Create a GA4 property at [Google Analytics](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `src/layouts/BaseLayout.astro` in the `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Step 7: Add AdSense (Optional)

### 6.1 Apply for AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Apply for an account
3. Wait for approval (usually 1-2 weeks)

### 6.2 Add AdSense Code

Once approved:

1. Get your AdSense Publisher ID (format: `ca-pub-XXXXXXXXXX`)
2. Add to `src/layouts/BaseLayout.astro` in the `<head>`:

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossorigin="anonymous"></script>
```

3. Update `src/components/common/AdSlot.astro` with your ad units

## Step 8: Generate Missing Tool Pages

We've created example tool pages. To generate all remaining tool pages, use the script:

```bash
# This will be created as a Node.js script
node scripts/generate-tool-pages.js
```

Or manually create pages following the pattern in `src/pages/json-formatter.astro`.

## Step 9: Performance Optimization

### 8.1 Verify Build

```bash
npm run build
```

Check the `dist` folder for output.

### 8.2 Test Locally

```bash
npm run preview
```

Visit `http://localhost:4321` to test the production build.

### 8.3 Lighthouse Audit

1. Deploy to Cloudflare Pages
2. Run Lighthouse audit in Chrome DevTools
3. Aim for scores > 90 in all categories

## Step 10: Continuous Deployment

Cloudflare Pages automatically deploys on every push to `main`:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. Cloudflare Pages will automatically rebuild and deploy

## Troubleshooting

### Build Fails

- Check build logs in Cloudflare Pages dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Domain Not Working

- Check DNS records are correct
- Wait for DNS propagation (can take up to 24 hours)
- Verify SSL certificate is issued

### Tools Not Working

- Ensure React components have `client:load` directive
- Check browser console for errors
- Verify all dependencies are installed

## Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/cloudflare/)
- [Cloudflare Pages Pricing](https://developers.cloudflare.com/pages/platform/pricing/)

## Support

For issues or questions:
- Open an issue on GitHub
- Check Cloudflare Pages documentation
- Review Astro documentation

---

**Congratulations!** Your DevTools.site should now be live on Cloudflare Pages! 🎉


