import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Plus, Trash2, RefreshCw, AlertCircle, Image as ImageIcon, FileText, Loader, Check, Zap, Shield, X, Menu, Play, Star, ChevronRight, ArrowRight } from 'lucide-react';
import { routeTreeBase64 } from '../route-tree-data.js';

// PDF to image converter
const convertPdfToImages = async (file) => {
  const pdfjsLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    images.push({ base64, fileName: `${file.name}-page-${i}` });
  }

  return images;
};

// Dark theme colors (Hudl style)
const theme = {
  bg: '#1A1A1A',
  bgSecondary: '#242424',
  bgCard: '#2D2D2D',
  border: '#3A3A3A',
  primary: '#FF6600', // Hudl orange
  primaryHover: '#E55C00',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#6B6B6B',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B'
};

// ============ LANDING PAGE ============
function LandingPage({ onStart }) {
  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: theme.bgSecondary, borderBottom: `1px solid ${theme.border}` }} className="sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <FileSpreadsheet style={{ color: '#FFFFFF' }} size={20} />
              </div>
              <span className="font-bold text-xl" style={{ color: theme.text }}>Hudl Playbook AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: theme.textSecondary }}>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            </div>
            <button
              onClick={onStart}
              className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg flex items-center gap-2"
              style={{ backgroundColor: theme.primary }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
            >
              Start Converting <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ backgroundColor: theme.primary, filter: 'blur(100px)' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: theme.primary, filter: 'blur(120px)' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
              <Zap size={16} />
              <span>AI-Powered Playbook Conversion</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" style={{ color: theme.text }}>
              Turn Hudl Playbooks into
              <span style={{ color: theme.primary }}> Excel Sheets</span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: theme.textSecondary }}>
              Upload your playbook screenshots or PDFs and let AI extract every play. Server-side processing means it works even when you switch tabs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={onStart}
                className="px-8 py-4 text-white text-lg font-semibold rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.primary }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
              >
                <Upload size={20} />
                Start Converting Free
              </button>
              <button className="px-8 py-4 text-lg font-semibold rounded-2xl border-2 flex items-center justify-center gap-2 transition-all hover:opacity-80" style={{ borderColor: theme.border, color: theme.text }}>
                <Play size={20} />
                Watch Demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{ color: theme.textSecondary }}>
              <div className="flex items-center gap-2">
                <Shield size={18} style={{ color: theme.success }} />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} style={{ color: theme.success }} />
                <span>Server-side processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} style={{ color: theme.success }} />
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ backgroundColor: theme.bgSecondary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme.text }}>Features</h2>
            <p className="text-xl" style={{ color: theme.textSecondary }}>Everything you need to convert your playbooks</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={28} />,
                title: "Server-Side Processing",
                desc: "Processing happens on our servers. Close the tab, switch windows - it keeps running in the background.",
                color: theme.warning
              },
              {
                icon: <Shield size={28} />,
                title: "Position-Specific",
                desc: "Select your position (QB, RB, WR, TE, etc.) and get YOUR specific routes and assignments.",
                color: '#3B82F6'
              },
              {
                icon: <Download size={28} />,
                title: "Excel Export",
                desc: "Get beautifully formatted Excel sheets ready to print or share with your team.",
                color: theme.success
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl p-8 transition-all hover:scale-105" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: theme.text }}>{feature.title}</h3>
                <p style={{ color: theme.textSecondary }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme.text }}>How It Works</h2>
            <p className="text-xl" style={{ color: theme.textSecondary }}>Three simple steps to your playcalling sheet</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Playbook", desc: "Take screenshots from Hudl or export as PDF. Upload them to our tool." },
              { step: "02", title: "AI Extracts Plays", desc: "Our AI analyzes every play on our servers - works even with tab closed." },
              { step: "03", title: "Export to Excel", desc: "Review, edit if needed, and download your formatted Excel playcalling sheet." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="rounded-2xl p-8 h-full" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}>
                  <span className="text-6xl font-black absolute top-4 right-6" style={{ color: `${theme.primary}20` }}>{item.step}</span>
                  <h3 className="text-xl font-bold mb-3" style={{ color: theme.text }}>{item.title}</h3>
                  <p style={{ color: theme.textSecondary }}>{item.desc}</p>
                </div>
                {i < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2" size={32} style={{ color: theme.border }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: theme.bgSecondary }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: theme.text }}>Ready to Save Hours Every Week?</h2>
          <p className="text-xl mb-10" style={{ color: theme.textSecondary }}>Join hundreds of players and coaches who've already simplified their playbook preparation.</p>
          <button
            onClick={onStart}
            className="px-10 py-5 text-white text-lg font-bold rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-2 mx-auto"
            style={{ backgroundColor: theme.primary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
          >
            <Upload size={24} />
            Start Converting Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: theme.bg, borderTop: `1px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                  <FileSpreadsheet style={{ color: '#FFFFFF' }} size={18} />
                </div>
                <span className="font-bold" style={{ color: theme.text }}>Hudl Playbook AI</span>
              </div>
              <p className="text-sm" style={{ color: theme.textSecondary }}>The fastest way to convert Hudl playbooks into Excel playcalling sheets.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: theme.text }}>Product</h4>
              <ul className="space-y-2 text-sm" style={{ color: theme.textSecondary }}>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: theme.text }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: theme.textSecondary }}>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: theme.text }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: theme.textSecondary }}>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm" style={{ color: theme.textMuted, borderTop: `1px solid ${theme.border}` }}>
            <p>© 2024 Hudl Playbook AI Converter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============ MAIN APP ============
export default function HudlPlaybookAIConverter() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [plays, setPlays] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('FB');

  if (currentPage === 'landing') {
    return <LandingPage onStart={() => setCurrentPage('upload')} />;
  }

  const columns = [
    { id: 'col1', name: 'Formation/Play', textBold: true },
    { id: 'col2', name: 'Route/Blocking', textBold: true }
  ];

  const positions = [
    { value: 'QB', label: 'Quarterback', desc: 'QB' },
    { value: 'RB', label: 'Running Back', desc: 'RB' },
    { value: 'FB', label: 'Fullback / A-Back', desc: 'FB' },
    { value: 'X', label: 'X Receiver', desc: 'X' },
    { value: 'Y', label: 'Y Receiver', desc: 'Y' },
    { value: 'Z', label: 'Z Receiver', desc: 'Z' },
    { value: 'H', label: 'H-Back', desc: 'H' },
    { value: 'TE', label: 'Tight End', desc: 'TE' }
  ];

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const ext = file.name.toLowerCase();
      return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') ||
             ext.endsWith('.pdf') || ext.endsWith('.webp');
    });

    if (validFiles.length === 0) {
      setError('Please upload PNG, JPG, or PDF files');
      return;
    }

    setUploadedFiles(validFiles);
    setError(null);
  };

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Call Moonshot API directly from client
  const processFilesWithAI = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStatus('Starting AI processing...');

    const positionMap = {
      'QB': 'QB, 1',
      'RB': 'RB, 2, Running Back',
      'FB': 'FB, A, Fullback, A-back',
      'X': 'X, X-receiver, Split End',
      'Y': 'Y, Y-receiver, Slot',
      'Z': 'Z, Z-receiver, Flanker',
      'H': 'H, H-back, Wing',
      'TE': 'TE, T, Tight End'
    };

    try {
      const allExtractedPlays = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setProcessingStatus(`Processing ${file.name} (${i + 1}/${uploadedFiles.length})...`);

        // Handle PDF files - convert to images first
        let imagesToProcess = [];
        if (file.type === 'application/pdf') {
          setProcessingStatus(`Converting PDF ${file.name} to images...`);
          imagesToProcess = await convertPdfToImages(file);
        } else {
          const base64 = await fileToBase64(file);
          imagesToProcess = [{ base64, fileName: file.name }];
        }

        const posLabels = positionMap[selectedPosition] || selectedPosition;

        // Optimized prompt for football playbook extraction
        const prompt = `Extract plays for the ${selectedPosition} position from this football playbook page.

POSITION: ${posLabels}

INSTRUCTIONS:
1. Find the CONCEPT in the page header (last word or two: STICK, CROSS, GLANCE, etc.)
2. Find EVERY formation diagram on the page
3. For each formation, find what ${posLabels} does (route or blocking)
4. Extract ONLY the value - no labels, no "Formation:", "Route:", etc.

COLUMN VALUES (plain text only):
- col1: Formation name ONLY (e.g., "2x2 Twin", "3x1 Stack", "Trips") - NOT "Formation: 2x2 Twin"
- col2: Route name ONLY if running route (e.g., "Flat", "Stick", "Out") - leave empty "" if blocking
- col3: Concept name from header (e.g., "STICK", "CROSS")
- col4: Blocking ONLY if blocking (e.g., "Seal", "Kick out") - leave empty "" if running route

COMMON FORMATIONS: 2x2, 3x1, Twin, Trips, Stack, Double Stack, Empty
COMMON ROUTES: Flat, Stick, Slant, Out, In, Go, Post, Corner, Hitch, Curl, Cross, Shallow, Dig, Wheel

OUTPUT JSON ARRAY (no markdown, no explanation):
[
  {"col1": "2x2 Twin", "col2": "Flat", "col3": "STICK", "col4": ""},
  {"col1": "3x1 Stack", "col2": "", "col3": "STICK", "col4": "Seal inside"}
]

Extract ALL formations shown on the page. Return ONLY the JSON array.`;

        // Process each image (PDF may have multiple pages)
        // Add delay between requests to avoid rate limiting
        const BATCH_DELAY = 500; // ms between requests
        const startTime = Date.now();

        for (let j = 0; j < imagesToProcess.length; j++) {
          const { base64, fileName } = imagesToProcess[j];
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const eta = imagesToProcess.length > 1
            ? Math.round((elapsed / (j + 1)) * (imagesToProcess.length - j - 1))
            : 0;
          setProcessingStatus(`Processing ${fileName} (${j + 1}/${imagesToProcess.length}) - ${elapsed}s elapsed, ~${eta}s remaining...`);

          // Add delay between requests (except first)
          if (j > 0) {
            await new Promise(r => setTimeout(r, BATCH_DELAY));
          }

          // Call local server - runs even when tab is in background!
          const response = await fetch('http://localhost:3002/api/extract-plays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, fileName, position: selectedPosition })
          });

          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }

          const data = await response.json();

          if (data.success && data.plays && data.plays.length > 0) {
            allExtractedPlays.push(...data.plays.map((play, idx) => ({
              id: `play-${Date.now()}-${i}-${j}-${idx}`,
              col1: play.col1 || '',
              col2: play.col2 || '',
              col3: play.col3 || '',
              col4: play.col4 || ''
            })));
          }
        } // End of images loop
      } // End of files loop

      setProcessingStatus('Finalizing your playsheet...');

      if (allExtractedPlays.length > 0) {
        setPlays(allExtractedPlays);
        setShowEditor(true);
        setProcessingStatus('');
      } else {
        setError('No plays could be extracted. Check that your playbook pages show clear play diagrams with formations, routes, and assignments.');
      }

    } catch (err) {
      console.error('Processing error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addRow = () => {
    setPlays([...plays, { id: `play-${Date.now()}`, col1: '', col2: '', col3: '', col4: '' }]);
  };

  const deleteRow = (id) => {
    setPlays(plays.filter(p => p.id !== id));
  };

  const updateCell = (playId, column, value) => {
    setPlays(plays.map(p =>
      p.id === playId ? { ...p, [column]: value } : p
    ));
  };

  const duplicateRow = (play) => {
    const newPlay = { ...play, id: `play-${Date.now()}` };
    const index = plays.findIndex(p => p.id === play.id);
    const newPlays = [...plays];
    newPlays.splice(index + 1, 0, newPlay);
    setPlays(newPlays);
  };

  const exportToExcel = async () => {
    try {
      const ExcelJS = await import('https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Playsheet');

      worksheet.columns = [
        { width: 14.27 }, { width: 14.93 }, { width: 13.0 }, { width: 14.53 }
      ];

      plays.forEach((play) => {
        const row = worksheet.addRow([play.col1, play.col2, play.col3, play.col4]);
        row.height = 11.85;

        row.eachCell((cell, colNumber) => {
          const colConfig = columns[colNumber - 1];

          // Map dark theme colors to Excel colors
          const bgColorMap = {
            '#2D2D2D': 'FF2D2D2D',
            '#3D3D00': 'FF3D3D00',
            '#3D0000': 'FF3D0000'
          };

          cell.font = {
            name: 'Aptos Narrow',
            size: 10,
            bold: colConfig.textBold,
            color: { argb: 'FFFFFFFF' }
          };

          if (colConfig.bgColor !== '#2D2D2D') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: bgColorMap[colConfig.bgColor] || 'FF2D2D2D' }
            };
          } else {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF2D2D2D' }
            };
          }

          cell.border = {
            top: { style: 'thin', color: { argb: 'FF4A4A4A' } },
            left: { style: 'thin', color: { argb: 'FF4A4A4A' } },
            bottom: { style: 'thin', color: { argb: 'FF4A4A4A' } },
            right: { style: 'thin', color: { argb: 'FF4A4A4A' } }
          };
          cell.alignment = { vertical: 'middle' };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playsheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Export error: ${err.message}`);
    }
  };

  // Helper function to determine cell color based on content
  const getCellColor = (value) => {
    if (!value || value.trim() === '') return '#2D2D2D'; // Empty - dark gray

    const lowerValue = value.toLowerCase();

    // Blocking keywords
    const blockingKeywords = ['block', 'seal', 'kick', 'lead', 'protect', 'cup', 'ray', 'lou', 'gap', 'bs end', 'area', 'first', 'second', 'pull', 'fill', 'follow'];
    const isBlocking = blockingKeywords.some(kw => lowerValue.includes(kw));
    if (isBlocking) return '#3D0000'; // Red for blocking

    // Route keywords
    const routeKeywords = ['flat', 'wheel', 'slant', 'out', 'in', 'go', 'post', 'corner', 'hitch', 'dig', 'curl', 'shoot', '5 out', 'tab', 'delayed', 'comeback', 'seam', 'quick', 'cross', 'glance', 'stick', 'smash', 'spacing', 'shallow', 'moses', 'power', 'iso', 'trey'];
    const isRoute = routeKeywords.some(kw => lowerValue.includes(kw));
    if (isRoute) return '#3D3D00'; // Yellow for routes

    return '#2D2D2D'; // Default dark gray
  };

  const CellEditor = ({ play, column, config }) => {
    const isEditing = editingCell === `${play.id}-${column}`;
    const value = play[column];

    if (isEditing) {
      return (
        <textarea
          value={value}
          onChange={(e) => updateCell(play.id, column, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingCell(null);
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              setEditingCell(null);
            }
          }}
          autoFocus
          className="w-full px-2 py-1 border-2 rounded resize-none"
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', borderColor: theme.primary }}
          rows={2}
        />
      );
    }

    return (
      <div
        onClick={() => setEditingCell(`${play.id}-${column}`)}
        className="cursor-text px-2 py-2 min-h-[40px] flex items-center hover:ring-2 rounded whitespace-pre-wrap break-words"
        style={{
          color: value ? theme.text : theme.textMuted,
          ringColor: theme.primary,
          backgroundColor: getCellColor(value)
        }}
      >
        {value || <span style={{ color: theme.textMuted }}>Click to edit</span>}
      </div>
    );
  };

  // ============ UPLOAD VIEW ============
  if (!showEditor) {
    return (
      <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
        {/* Navigation */}
        <nav style={{ backgroundColor: theme.bgSecondary, borderBottom: `1px solid ${theme.border}` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setCurrentPage('landing')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                  <FileSpreadsheet style={{ color: '#FFFFFF' }} size={20} />
                </div>
                <span className="font-bold text-xl" style={{ color: theme.text }}>Hudl Playbook AI</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ color: theme.text }}>
              Convert Your
              <span style={{ color: theme.primary }}> Playbook</span>
            </h1>
            <p className="text-lg" style={{ color: theme.textSecondary }}>
              Server-side AI processing - works even when you switch tabs
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}>
              <div className="p-8">

                {error && (
                  <div className="mb-6 rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: `${theme.error}20`, border: `1px solid ${theme.error}40` }}>
                    <AlertCircle style={{ color: theme.error }} size={20} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: theme.error }}>Error</p>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>{error}</p>
                    </div>
                    <button onClick={() => setError(null)}><X size={18} style={{ color: theme.textSecondary }} /></button>
                  </div>
                )}

                {!isProcessing && uploadedFiles.length === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3" style={{ color: theme.text }}>Select Your Position</label>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {positions.map(pos => (
                          <button
                            key={pos.value}
                            onClick={() => setSelectedPosition(pos.value)}
                            className={`px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                              selectedPosition === pos.value
                                ? 'text-white shadow-lg'
                                : 'hover:opacity-80'
                            }`}
                            style={selectedPosition === pos.value
                              ? { backgroundColor: theme.primary }
                              : { backgroundColor: theme.bgSecondary, color: theme.textSecondary, border: `1px solid ${theme.border}` }
                            }
                            title={pos.label}
                          >
                            {pos.desc}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs mt-2" style={{ color: theme.textSecondary }}>
                        AI will extract routes for <strong style={{ color: theme.text }}>{positions.find(p => p.value === selectedPosition)?.label}</strong>
                      </p>
                    </div>

                    <label className="block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all hover:border-orange-500" style={{ borderColor: theme.border }}>
                      <Upload className="mx-auto mb-4" size={48} style={{ color: theme.textSecondary }} />
                      <span className="font-semibold text-lg block" style={{ color: theme.primary }}>
                        Click to upload your playbook
                      </span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.webp"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-sm mt-2" style={{ color: theme.textSecondary }}>
                        Supports PNG, JPG, PDF • Multiple files allowed
                      </p>
                    </label>
                  </div>
                )}

                {uploadedFiles.length > 0 && !isProcessing && (
                  <div className="space-y-4">
                    <h3 className="font-semibold" style={{ color: theme.text }}>
                      Ready to process ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''})
                    </h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: theme.bgSecondary }}>
                          {file.type === 'application/pdf' ? (
                            <FileText size={20} style={{ color: theme.error }} />
                          ) : (
                            <ImageIcon size={20} style={{ color: theme.primary }} />
                          )}
                          <span className="flex-1 text-sm font-medium truncate" style={{ color: theme.text }}>{file.name}</span>
                          <span className="text-xs" style={{ color: theme.textSecondary }}>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                          <button onClick={() => removeFile(idx)} className="p-1 hover:bg-gray-700 rounded-lg"><X size={16} style={{ color: theme.textSecondary }} /></button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={processFilesWithAI}
                      className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: theme.primary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.primaryHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.primary}
                    >
                      <Zap size={20} />
                      Extract Plays with AI
                    </button>
                    <button onClick={() => setUploadedFiles([])} className="w-full py-2 text-sm hover:bg-gray-800 rounded-xl" style={{ color: theme.textSecondary }}>
                      Choose different files
                    </button>
                  </div>
                )}

                {isProcessing && (
                  <div className="p-8 text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full opacity-30" style={{ backgroundColor: theme.primary }}></div>
                      <Loader className="w-full h-full animate-spin" style={{ color: theme.primary }} />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: theme.text }}>Processing on server...</h3>
                    <p style={{ color: theme.textSecondary }}>{processingStatus}</p>
                    <p className="text-xs mt-4" style={{ color: theme.textMuted }}>
                      You can switch tabs - processing continues on our servers
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ EDITOR VIEW ============
  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh' }}>
      <header style={{ backgroundColor: theme.bgSecondary, borderBottom: `1px solid ${theme.border}` }} className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <FileSpreadsheet style={{ color: '#FFFFFF' }} size={22} />
              </div>
              <div>
                <h1 className="font-bold text-lg" style={{ color: theme.text }}>Playcalling Sheet Editor</h1>
                <p className="text-sm" style={{ color: theme.textSecondary }}>
                  {plays.length} play{plays.length !== 1 ? 's' : ''} extracted • {positions.find(p => p.value === selectedPosition)?.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={addRow} className="px-4 py-2 rounded-xl font-medium text-white text-sm flex items-center gap-2" style={{ backgroundColor: theme.success }}>
                <Plus size={16} />Add Row
              </button>
              <button onClick={() => { setShowEditor(false); setPlays([]); setUploadedFiles([]); }} className="px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 hover:opacity-80" style={{ backgroundColor: theme.bgCard, color: theme.text }}>
                <RefreshCw size={16} />New
              </button>
              <button onClick={exportToExcel} disabled={plays.length === 0} className="px-5 py-2 rounded-xl font-semibold text-white text-sm flex items-center gap-2 shadow-lg disabled:opacity-50" style={{ backgroundColor: theme.primary }}>
                <Download size={16} />Export Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-xl p-4 flex items-center gap-3 mb-6" style={{ backgroundColor: `${theme.success}20`, border: `1px solid ${theme.success}40` }}>
          <Check size={20} style={{ color: theme.success }} />
          <p className="text-sm font-medium" style={{ color: theme.success }}>Plays extracted! Review and edit before exporting.</p>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th className="w-12 p-3 text-xs font-semibold text-center" style={{ color: theme.textMuted }}>#</th>
                  {columns.map((col) => (
                    <th key={col.id} className="p-3 text-left font-semibold text-sm" style={{ backgroundColor: theme.bgSecondary, color: theme.text, borderLeft: `1px solid ${theme.border}` }}>
                      {col.name}
                    </th>
                  ))}
                  <th className="w-24 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {plays.map((play, rowIndex) => (
                  <tr key={play.id} style={{ borderBottom: `1px solid ${theme.border}30` }} className="hover:bg-white/5">
                    <td className="p-3 text-center text-sm font-medium" style={{ color: theme.textMuted }}>{rowIndex + 1}</td>
                    {columns.map((col) => (
                      <td key={col.id} style={{ borderLeft: `1px solid ${theme.border}30` }}>
                        <CellEditor play={play} column={col.id} config={col} />
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button onClick={() => duplicateRow(play)} className="p-2 hover:bg-white/10 rounded-lg"><Plus size={14} style={{ color: theme.textSecondary }} /></button>
                        <button onClick={() => deleteRow(play.id)} className="p-2 hover:bg-white/10 rounded-lg"><Trash2 size={14} style={{ color: theme.error }} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {plays.length === 0 && (
            <div className="p-12 text-center">
              <FileSpreadsheet size={48} className="mx-auto mb-4" style={{ color: theme.textMuted }} />
              <p style={{ color: theme.textSecondary }}>No plays yet. Add rows manually or upload a new playbook.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
