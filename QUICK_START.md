# 🚀 Quick Start Guide

## Fastest Way to Get Started (3 minutes)

### Method 1: Use Claude.ai Artifact (Easiest - No Installation!)

1. Copy the contents of `hudl-playbook-ai-converter.jsx`
2. Go to Claude.ai
3. Ask Claude: "Create a React app with this code: [paste the code]"
4. Claude will create an interactive artifact you can use immediately
5. Upload your playbook images/PDFs and start converting!

**Pros**: No installation, works immediately, no technical knowledge needed
**Cons**: Can't save or share the URL easily

---

### Method 2: Deploy to Vercel (Best for Teams - 5 minutes)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub (free)

2. **Install Vercel CLI** (one-time setup)
   ```bash
   npm install -g vercel
   ```

3. **Download & Deploy**
   - Download all files from the outputs folder
   - Open terminal in that folder
   - Run:
   ```bash
   npm install
   vercel
   ```
   - Follow prompts (press Enter for defaults)

4. **Done!** Vercel gives you a URL you can share with your team

**Pros**: Permanent URL, can share with team, professional
**Cons**: Requires terminal/command line

---

### Method 3: Run Locally (For Development - 2 minutes)

1. **Download Files**
   - Download all files from outputs folder

2. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

3. **Open Browser**
   - Go to http://localhost:3000

**Pros**: Full control, fast, private
**Cons**: Only works on your computer

---

## 📱 Using the App

### Step 1: Upload Your Playbook
- Take screenshots of your Hudl playbook pages
- Or export playbook as PDF from Hudl
- Upload one or multiple files

### Step 2: Let AI Extract the Plays
- Click "Extract Plays with AI"
- Wait 30-60 seconds while AI processes your files
- AI will identify formations, routes, blocking, and notes

### Step 3: Review & Edit
- Check the extracted plays
- Click any cell to edit
- Add new rows with "Add" button
- Delete rows with trash icon

### Step 4: Export to Excel
- Click "Export" button
- Opens formatted Excel file
- Matches your template exactly
- Ready to print or use on the sidelines!

---

## 🎯 Tips for Best Results

### For Screenshots:
✅ Take clear, high-resolution screenshots
✅ Ensure text is readable
✅ One play per screenshot works best
✅ Good lighting/contrast

### For PDFs:
✅ Export directly from Hudl if possible
✅ One page per play is ideal
✅ Ensure PDF is text-based, not scanned image

### General Tips:
- Upload multiple files at once to save time
- Always review AI extractions before exporting
- Save your work by keeping the uploaded files
- Use Chrome or Edge for best compatibility

---

## ⚡ Troubleshooting

**Problem**: AI not extracting correctly
- **Fix**: Ensure images are clear and high quality
- **Fix**: Try uploading individual pages
- **Fix**: Manually edit any mistakes

**Problem**: Export button not working
- **Fix**: Make sure you have at least one play
- **Fix**: Try Chrome/Edge browser
- **Fix**: Check browser console (F12) for errors

**Problem**: Upload fails
- **Fix**: Check file size (under 10MB per file)
- **Fix**: Verify file format (PNG, JPG, PDF only)
- **Fix**: Try fewer files at once

**Problem**: Can't access after deploying
- **Fix**: Check Vercel dashboard for your URL
- **Fix**: Make sure deployment finished successfully
- **Fix**: Try incognito/private browsing mode

---

## 📞 Need Help?

1. Check the main README.md for detailed documentation
2. Review error messages in browser console (F12)
3. Try the troubleshooting section above
4. Re-deploy if something went wrong

---

## 🎉 You're Ready!

Choose your method above and start converting your playbook in minutes!

**Recommended for most users**: Method 1 (Claude.ai Artifact) for immediate use, then Method 2 (Vercel) when you want to share with your team.
