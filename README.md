# Hudl Playbook AI Converter

Transform your Hudl playbook screenshots or PDFs into formatted Excel playcalling sheets using AI.

## 🏈 What It Does

Players can upload:
- **PNG/JPG screenshots** of Hudl playbook pages
- **PDF exports** from Hudl
- **Multiple files** at once

The AI will:
1. Extract play information (formations, routes, blocking, notes)
2. Organize it into a 4-column playcalling sheet format
3. Apply professional formatting (colors, borders, fonts)
4. Generate a downloadable Excel file matching your template

## 🚀 Features

- ✅ AI-powered OCR and text extraction
- ✅ Processes images (PNG, JPG, WEBP) and PDFs
- ✅ Multi-file upload support
- ✅ Interactive editor to review/modify extracted plays
- ✅ Add, edit, duplicate, and delete plays
- ✅ Export to formatted Excel (.xlsx)
- ✅ Matches your exact template formatting

## 📋 How to Use

### Option 1: Deploy on Vercel (Recommended - Free)

1. Create a free account at [Vercel](https://vercel.com)

2. Install Vercel CLI:
```bash
npm install -g vercel
```

3. Create a new project folder:
```bash
mkdir hudl-converter
cd hudl-converter
```

4. Copy the `hudl-playbook-ai-converter.jsx` file into this folder

5. Create a `package.json`:
```json
{
  "name": "hudl-playbook-converter",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.9"
  }
}
```

6. Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hudl Playbook AI Converter</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

7. Create `src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../hudl-playbook-ai-converter.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

8. Create `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

9. Deploy:
```bash
npm install
vercel
```

### Option 2: Run Locally

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open `http://localhost:5173` in your browser

### Option 3: Deploy to Netlify

1. Create account at [Netlify](https://netlify.com)
2. Drag and drop your project folder
3. Netlify will auto-detect and deploy

## 🎨 Customization

### Change Column Colors

Edit the `columns` array in the code:

```jsx
const columns = [
  { id: 'col1', name: 'Formation/Play', bgColor: 'white', textBold: true },
  { id: 'col2', name: 'Route/Action', bgColor: '#FFFF00', textBold: true },
  { id: 'col3', name: 'Blocking', bgColor: 'white', textBold: false },
  { id: 'col4', name: 'Notes', bgColor: '#FF7C80', textBold: true }
];
```

### Change Column Names

Update the `name` property for each column above.

### Adjust AI Extraction

Modify the prompt in `processImage()` and `processPDF()` functions to change what information the AI extracts.

## 💡 Tips for Best Results

1. **Clear Screenshots**: Ensure playbook screenshots are clear and high-resolution
2. **One Page Per File**: For best results, upload one playbook page per image
3. **Review Before Export**: Always review and edit the AI-extracted plays before exporting
4. **Multiple Uploads**: You can upload multiple files at once for batch processing

## 🔧 Technical Details

- **Frontend**: React with Tailwind CSS
- **AI**: Claude Sonnet 4 (via Anthropic API)
- **Excel Export**: ExcelJS library
- **File Formats**: PNG, JPG, WEBP, PDF

## 📝 File Structure

```
hudl-converter/
├── hudl-playbook-ai-converter.jsx  # Main React component
├── package.json                     # Dependencies
├── vite.config.js                   # Build configuration
├── index.html                       # HTML template
└── src/
    └── main.jsx                     # React entry point
```

## ❓ Troubleshooting

### AI Not Extracting Plays Correctly?
- Ensure images are high quality and text is readable
- Try uploading individual pages instead of multi-page PDFs
- Manually edit any incorrectly extracted plays

### Export Not Working?
- Check browser console for errors
- Ensure you have plays in the sheet before exporting
- Try a different browser (Chrome/Edge recommended)

### Upload Fails?
- Check file format (must be PNG, JPG, or PDF)
- Ensure file size is under 10MB per file
- Try uploading fewer files at once

## 🆘 Support

If you encounter issues:
1. Check the console (F12 in browser) for error messages
2. Verify your files are in supported formats
3. Try refreshing the page and re-uploading

## 📄 License

Free to use for personal and team purposes.

## 🎯 Roadmap

Potential future features:
- [ ] Batch export multiple playsheets
- [ ] Save/load projects
- [ ] Custom column configurations
- [ ] Print-optimized layouts
- [ ] Formation diagram extraction
- [ ] Cloud storage integration

---

**Made for coaches and players** 🏈
