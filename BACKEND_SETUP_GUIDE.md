# 🚀 Complete Setup Guide: AI-Enabled Version

## What You Need

To make the AI extraction work on Netlify, you need:

1. ✅ **Anthropic API Key** - Get one at https://console.anthropic.com
2. ✅ **Netlify Account** - Free at https://netlify.com
3. ✅ **The updated files** - Provided in this package

---

## 📦 Files Included

### For AI-Enabled Deployment:
```
hudl-playbook-converter/
├── src/
│   ├── App-with-backend.jsx  ← Use THIS for AI features
│   └── main.jsx
├── netlify/
│   └── functions/
│       └── extract-plays.js   ← Backend serverless function
├── index.html
├── package.json
├── vite.config.js
└── netlify.toml
```

---

## 🎯 Step-by-Step Setup

### Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-...`)
6. **Keep it secret!** Never share or commit this key

**Cost**: 
- Free tier: $5 credit
- After that: ~$0.01-0.05 per image processed
- Very affordable for most teams

---

### Step 2: Prepare Your Files

1. **Download all files** from the outputs folder

2. **Rename App-with-backend.jsx to App.jsx**:
   ```bash
   # In your src/ folder:
   mv App-with-backend.jsx App.jsx
   ```
   
   Or manually:
   - Delete the old `src/App.jsx`
   - Rename `src/App-with-backend.jsx` to `src/App.jsx`

3. **Verify your file structure**:
   ```
   hudl-playbook-converter/
   ├── src/
   │   ├── App.jsx  (the renamed file with backend support)
   │   └── main.jsx
   ├── netlify/
   │   └── functions/
   │       └── extract-plays.js
   ├── index.html
   ├── package.json
   ├── vite.config.js
   └── netlify.toml
   ```

---

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Navigate to your project
cd hudl-playbook-converter

# 4. Install dependencies
npm install

# 5. Deploy
netlify deploy --prod
```

#### Option B: Git + Netlify Dashboard

```bash
# 1. Initialize git
cd hudl-playbook-converter
git init
git add .
git commit -m "Initial commit with Netlify Functions"

# 2. Push to GitHub
# Create a repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/hudl-playbook.git
git push -u origin main

# 3. In Netlify dashboard:
# - Click "Add new site"
# - Choose "Import an existing project"
# - Select your GitHub repo
# - Build settings auto-detected from netlify.toml
# - Click "Deploy site"
```

#### Option C: Drag & Drop (Simpler, but requires build first)

```bash
# 1. Build locally
cd hudl-playbook-converter
npm install
npm run build

# 2. Go to Netlify
# - Visit https://app.netlify.com
# - Click "Add new site" → "Deploy manually"
# - Drag your ENTIRE PROJECT FOLDER (not just dist/)
```

---

### Step 4: Add Your API Key to Netlify

**CRITICAL STEP** - Without this, the AI won't work!

1. **Go to your Netlify dashboard**
   - https://app.netlify.com
   - Select your deployed site

2. **Navigate to Site settings**
   - Click "Site configuration"
   - Click "Environment variables"

3. **Add the API key**:
   - Click "Add a variable"
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your API key from Step 1)
   - Click "Create variable"

4. **Redeploy your site**:
   - Go to "Deploys"
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - Wait 2-3 minutes

---

### Step 5: Test It!

1. **Open your deployed site** (URL like `your-site.netlify.app`)

2. **Upload a test PNG** of a play from Hudl

3. **Click "Extract Plays with AI"**

4. **Check if it works**:
   - Should process in 30-60 seconds
   - Plays should appear in the editor
   - If it fails, check browser console (F12)

---

## 🐛 Troubleshooting

### "API Key not configured" error?

**Fix**: Make sure you added `ANTHROPIC_API_KEY` to Netlify environment variables and redeployed.

```bash
# Verify in Netlify CLI:
netlify env:list
```

### "500 Server Error" when processing?

**Possible causes**:
1. API key is wrong or expired
2. API key doesn't have proper permissions
3. Anthropic API is down (check status.anthropic.com)

**Check logs**:
```bash
# In Netlify CLI:
netlify functions:log extract-plays

# Or in Netlify Dashboard:
# Functions → extract-plays → Function log
```

### Images process but extract nothing?

**Possible issues**:
1. Image quality is too low
2. Image doesn't contain clear text
3. Image is too complex for AI to parse

**Solution**: Try with a clearer screenshot or manually enter the plays.

### Build fails?

**Check**:
- Is `src/App.jsx` present (not App-with-backend.jsx)?
- Is `netlify/functions/extract-plays.js` present?
- Did you run `npm install`?
- Check Netlify build logs for specific errors

---

## 💰 Cost Breakdown

### Anthropic API Pricing (as of 2025):

**Claude Sonnet 4**:
- Input: $3 per million tokens
- Output: $15 per million tokens

**Typical usage**:
- 1 playbook page image ≈ 1,000 input tokens
- AI response ≈ 500 output tokens
- **Cost per image: ~$0.01**

**Example monthly costs**:
- 100 images/month = $1
- 500 images/month = $5
- 1000 images/month = $10

**Very affordable for most teams!**

### Netlify Pricing:
- Hosting: **FREE**
- Functions: **125K requests/month FREE**
- Bandwidth: **100GB/month FREE**

**Total monthly cost for typical team**: $1-5 for API calls, $0 for hosting

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] Anthropic API key obtained
- [ ] `src/App-with-backend.jsx` renamed to `src/App.jsx`
- [ ] `netlify/functions/extract-plays.js` exists
- [ ] Project deployed to Netlify
- [ ] `ANTHROPIC_API_KEY` added to Netlify environment variables
- [ ] Site redeployed after adding API key
- [ ] Test upload works

---

## 🎓 Understanding How It Works

### The Architecture:

```
User's Browser
    ↓
    Uploads PNG
    ↓
Your Frontend (React App)
    ↓
    Converts to Base64
    ↓
Netlify Function (/api/extract-plays)
    ↓
    Calls Anthropic API with API key
    ↓
Claude AI analyzes the image
    ↓
    Returns structured JSON
    ↓
Netlify Function processes response
    ↓
Frontend displays plays in editor
    ↓
User edits and exports to Excel
```

**Key point**: The API key never leaves the server. It's securely stored in Netlify's environment variables and only used by the serverless function.

---

## 🚀 Alternative: Vercel Deployment

If you prefer Vercel over Netlify:

1. **Create `api/extract-plays.js` (Vercel format)**:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Same logic as Netlify function
  // ... (copy from extract-plays.js)
}
```

2. **Set environment variable** in Vercel dashboard:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key

3. **Deploy**:
```bash
npm install -g vercel
vercel
```

---

## 📞 Need Help?

1. Check Netlify function logs
2. Check browser console (F12)
3. Verify API key is correct
4. Test with a very simple, clear image first
5. Make sure you redeployed after adding the API key

---

## 🎉 You're Done!

Once deployed with the API key configured, your team can:
- Upload Hudl playbook screenshots
- AI extracts plays automatically
- Edit and refine the extracted data
- Export to formatted Excel sheets
- Share the URL with the whole team

**All for ~$0.01 per image processed!** 🏈
