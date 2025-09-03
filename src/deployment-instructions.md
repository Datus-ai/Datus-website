# Deployment Instructions for Datus Website

## Option 1: Build and Deploy (Recommended)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build for Production
```bash
npm run build
```

This creates a `dist` folder with all static files (HTML, CSS, JS) that can be deployed anywhere.

### Step 3: Deploy Options

#### A. Netlify (Easiest)
1. Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
2. Your site is live instantly with a custom URL

#### B. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Deploy the `dist` folder

#### C. GitHub Pages
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set source to "Deploy from a branch"
4. Select the branch with your `dist` folder

#### D. Any Web Host
Upload the contents of the `dist` folder to your web server's public directory.

---

## Option 2: Static HTML Version (No JavaScript)

If you need a pure HTML version without React, here's a simplified approach:

### Create index.html with inline styles
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Datus - AI Agent for Data Engineering</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Add custom animations and styles here */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
    </style>
</head>
<body>
    <!-- Convert your JSX to HTML here -->
</body>
</html>
```

---

## Option 3: Single File Website

Create a single HTML file with everything inline - perfect for sharing or simple hosting.

---

## Testing Locally

### Development Server
```bash
npm run dev
```

### Preview Built Version
```bash
npm run build
npm run preview
```

---

## Performance Tips

1. **Images**: Optimize images before deployment
2. **Caching**: Most hosting platforms handle this automatically
3. **CDN**: Netlify and Vercel provide CDN by default
4. **Compression**: Enable gzip compression on your server

---

## Domain Setup

1. **Custom Domain**: Most platforms allow custom domain setup
2. **SSL**: Automatically provided by Netlify/Vercel
3. **Analytics**: Add Google Analytics or similar

---

## Troubleshooting

**Blank page**: Check browser console for errors
**404 errors**: Ensure `base: './'` is set in vite.config.ts
**Missing icons**: Verify Lucide React is properly bundled