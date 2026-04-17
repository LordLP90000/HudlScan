import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, Plus, Trash2, RefreshCw, AlertCircle, Image as ImageIcon, FileText, Loader, Check, Zap, Shield, Clock, ArrowRight, X } from 'lucide-react';

export default function HudlPlaybookAIConverter() {
  const [plays, setPlays] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('FB');

  // Hudl-inspired color scheme
  const colors = {
    primary: '#FF6B35',      // Orange
    primaryDark: '#E55A2B',
    secondary: '#1A1A1A',    // Black
    accent: '#FFB347',        // Light orange
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    bg: '#F7F9FC',
    surface: '#FFFFFF',
    text: '#1F2937',
    textLight: '#6B7280'
  };

  const columns = [
    { id: 'col1', name: 'Formation/Play', bgColor: 'white', textBold: true },
    { id: 'col2', name: 'Route', bgColor: '#FEF3C7', textBold: true },
    { id: 'col3', name: 'Concept', bgColor: 'white', textBold: true },
    { id: 'col4', name: 'Blocking', bgColor: '#FEE2E2', textBold: true }
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

  const processFilesWithAI = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setProcessingStatus('Analyzing your playbook files...');

    try {
      const allExtractedPlays = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        setProcessingStatus(`Processing ${file.name} (${i + 1}/${uploadedFiles.length})...`);

        if (file.type === 'application/pdf') {
          const plays = await processPDF(file);
          allExtractedPlays.push(...plays);
        } else {
          const plays = await processImage(file);
          allExtractedPlays.push(...plays);
        }
      }

      setProcessingStatus('Finalizing your playsheet...');

      if (allExtractedPlays.length > 0) {
        setPlays(allExtractedPlays);
        setShowEditor(true);
        setProcessingStatus('');
      } else {
        setError('No plays could be extracted. Please check your files and try again.');
      }

    } catch (err) {
      setError(`Error processing files: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (file) => {
    const base64 = await fileToBase64(file);

    const response = await fetch('/api/extract-plays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        mediaType: file.type,
        fileName: file.name,
        position: selectedPosition
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.plays) {
      return data.plays.map((play, idx) => ({
        id: `play-${Date.now()}-${idx}`,
        col1: play.col1 || '',
        col2: play.col2 || '',
        col3: play.col3 || '',
        col4: play.col4 || ''
      }));
    }

    return [];
  };

  const processPDF = async (file) => {
    const base64 = await fileToBase64(file);

    const response = await fetch('/api/extract-plays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64,
        mediaType: file.type,
        fileName: file.name,
        position: selectedPosition
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.plays) {
      return data.plays.map((play, idx) => ({
        id: `play-${Date.now()}-${idx}`,
        col1: play.col1 || '',
        col2: play.col2 || '',
        col3: play.col3 || '',
        col4: play.col4 || ''
      }));
    }

    return [];
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
    const newPlay = {
      id: `play-${Date.now()}`,
      col1: '', col2: '', col3: '', col4: ''
    };
    setPlays([...plays, newPlay]);
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
          cell.font = {
            name: 'Aptos Narrow',
            size: 10,
            bold: colConfig.textBold
          };

          if (colConfig.bgColor !== 'white') {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF' + colConfig.bgColor.replace('#', '') }
            };
          }

          cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' },
            bottom: { style: 'thin' }, right: { style: 'thin' }
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
      setError(`Error exporting: ${err.message}`);
    }
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
          className="w-full px-2 py-1 border-2 border-orange-400 rounded resize-none bg-white"
          rows={2}
        />
      );
    }

    return (
      <div
        onClick={() => setEditingCell(`${play.id}-${column}`)}
        className="cursor-text px-2 py-2 min-h-[40px] flex items-center hover:ring-2 hover:ring-orange-300 rounded whitespace-pre-wrap break-words"
      >
        {value || <span className="text-gray-400 italic text-sm">Click to edit</span>}
      </div>
    );
  };

  // ============ UPLOAD VIEW ============
  if (!showEditor) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <FileSpreadsheet className="text-white" size={20} />
                </div>
                <span className="font-bold text-xl" style={{ color: colors.text }}>Hudl Playbook AI</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-sm" style={{ color: colors.textLight }}>
                <a href="#" className="hover:text-orange-500 transition-colors">How it works</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Pricing</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Support</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <Zap size={16} />
              <span>AI-Powered Playbook Conversion</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: colors.text }}>
              Turn Hudl Playbooks into
              <span style={{ color: colors.primary }}> Excel Sheets</span> in Seconds
            </h1>
            <p className="text-lg sm:text-xl mb-8" style={{ color: colors.textLight }}>
              Upload your playbook screenshots or PDFs and let AI extract every play. Get position-specific routes, concepts, and blocking assignments automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm" style={{ color: colors.textLight }}>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>No registration required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-green-500" />
                <span>Results in under 30 seconds</span>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

              {/* Error Display */}
              {error && (
                <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-red-800 font-semibold text-sm">Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="ml-auto">
                    <X size={18} className="text-red-400 hover:text-red-600" />
                  </button>
                </div>
              )}

              {/* Position Selector */}
              {!isProcessing && uploadedFiles.length === 0 && (
                <div className="p-6 border-b border-gray-100">
                  <label className="block text-sm font-semibold mb-3" style={{ color: colors.text }}>
                    Select Your Position
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {positions.map(pos => (
                      <button
                        key={pos.value}
                        onClick={() => setSelectedPosition(pos.value)}
                        className={`px-3 py-3 rounded-xl font-medium text-sm transition-all ${
                          selectedPosition === pos.value
                            ? 'text-white shadow-lg'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                        style={selectedPosition === pos.value ? { backgroundColor: colors.primary } : {}}
                        title={pos.label}
                      >
                        {pos.desc}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: colors.textLight }}>
                    AI will extract routes for <strong>{positions.find(p => p.value === selectedPosition)?.label}</strong>
                  </p>
                </div>
              )}

              {/* Upload Area */}
              {!isProcessing && uploadedFiles.length === 0 && (
                <div className="p-8">
                  <div
                    className="border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300"
                    style={{
                      borderColor: selectedPosition ? colors.primary : '#D1D5DB',
                      backgroundColor: selectedPosition ? '#FEF3C7' : 'transparent'
                    }}
                  >
                    <Upload className="mx-auto mb-4" size={48} style={{ color: colors.textLight }} />
                    <label className="cursor-pointer">
                      <span className="font-semibold text-lg" style={{ color: colors.primary }}>
                        Click to upload your playbook
                      </span>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.webp"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm mt-2" style={{ color: colors.textLight }}>
                      Supports PNG, JPG, PDF • Multiple files allowed
                    </p>
                  </div>
                </div>
              )}

              {/* File Preview */}
              {uploadedFiles.length > 0 && !isProcessing && (
                <div className="p-6">
                  <h3 className="font-semibold mb-4" style={{ color: colors.text }}>
                    Ready to process ({uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''})
                  </h3>
                  <div className="space-y-2 mb-4">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        {file.type === 'application/pdf' ? (
                          <FileText size={20} style={{ color: '#EF4444' }} />
                        ) : (
                          <ImageIcon size={20} style={{ color: colors.primary }} />
                        )}
                        <span className="flex-1 text-sm font-medium truncate" style={{ color: colors.text }}>
                          {file.name}
                        </span>
                        <span className="text-xs" style={{ color: colors.textLight }}>
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <X size={16} style={{ color: colors.textLight }} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={processFilesWithAI}
                    className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: colors.primary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primaryDark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                  >
                    <Zap size={20} />
                    Extract Plays with AI
                  </button>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="w-full mt-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-xl transition-colors"
                    style={{ color: colors.textLight }}
                  >
                    Choose different files
                  </button>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="p-12 text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.primary, opacity: 0.2 }}></div>
                    <Loader className="relative w-20 h-20 animate-spin" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                    Processing your playbook...
                  </h3>
                  <p className="mb-4" style={{ color: colors.textLight }}>{processingStatus}</p>
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    Processing happens on our server • Feel free to switch tabs
                  </p>
                </div>
              )}
            </div>

            {/* Features Grid */}
            {!isProcessing && uploadedFiles.length === 0 && (
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#FEF3C7' }}>
                    <Zap size={20} style={{ color: '#92400E' }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Lightning Fast</h3>
                  <p className="text-sm" style={{ color: colors.textLight }}>Extract plays in under 30 seconds</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#DBEAFE' }}>
                    <Shield size={20} style={{ color: '#1E40AF' }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Position-Specific</h3>
                  <p className="text-sm" style={{ color: colors.textLight }}>Get routes for your exact position</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#D1FAE5' }}>
                    <Download size={20} style={{ color: '#047857' }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Excel Export</h3>
                  <p className="text-sm" style={{ color: colors.textLight }}>Formatted ready-to-print sheets</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm" style={{ color: colors.textLight }}>
              <p>© 2024 Hudl Playbook AI Converter</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
                <a href="#" className="hover:text-orange-500 transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ============ EDITOR VIEW ============
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                <FileSpreadsheet className="text-white" size={22} />
              </div>
              <div>
                <h1 className="font-bold text-lg" style={{ color: colors.text }}>Playcalling Sheet Editor</h1>
                <p className="text-sm" style={{ color: colors.textLight }}>
                  {plays.length} play{plays.length !== 1 ? 's' : ''} extracted • {positions.find(p => p.value === selectedPosition)?.label}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={addRow}
                className="px-4 py-2 rounded-xl font-medium text-white text-sm flex items-center gap-2 transition-all hover:shadow-lg"
                style={{ backgroundColor: colors.success }}
              >
                <Plus size={16} />
                Add Row
              </button>
              <button
                onClick={() => {
                  setShowEditor(false);
                  setPlays([]);
                  setUploadedFiles([]);
                }}
                className="px-4 py-2 rounded-xl font-medium text-gray-700 text-sm flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={16} />
                New
              </button>
              <button
                onClick={exportToExcel}
                disabled={plays.length === 0}
                className="px-5 py-2 rounded-xl font-semibold text-white text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                <Download size={16} />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: '#D1FAE5' }}>
          <Check size={20} style={{ color: '#047857' }} />
          <p className="text-sm font-medium" style={{ color: '#065F46' }}>
            Plays extracted successfully! Review and edit before exporting.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-12 p-3 text-xs font-semibold text-gray-500 text-center">#</th>
                  {columns.map((col) => (
                    <th
                      key={col.id}
                      className="p-3 text-left font-semibold text-sm border-l border-gray-200"
                      style={{ backgroundColor: col.bgColor, color: colors.text }}
                    >
                      {col.name}
                    </th>
                  ))}
                  <th className="w-24 p-3"></th>
                </tr>
              </thead>
              <tbody>
                {plays.map((play, rowIndex) => (
                  <tr key={play.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-center text-sm font-medium text-gray-400">
                      {rowIndex + 1}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className="border-l border-gray-100"
                        style={{ backgroundColor: col.bgColor }}
                      >
                        <CellEditor play={play} column={col.id} config={col} />
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => duplicateRow(play)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate row"
                        >
                          <Plus size={14} style={{ color: colors.textLight }} />
                        </button>
                        <button
                          onClick={() => deleteRow(play.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete row"
                        >
                          <Trash2 size={14} style={{ color: colors.error }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {plays.length === 0 && (
            <div className="p-12 text-center">
              <FileSpreadsheet size={48} className="mx-auto mb-4" style={{ color: colors.textLight }} />
              <p style={{ color: colors.textLight }}>No plays yet. Add rows manually or upload a new playbook.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
