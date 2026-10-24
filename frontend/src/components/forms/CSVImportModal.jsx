import React, { useState } from 'react';
import { parseCSV } from '../../utils/csvParser';
import { CSV_SCHEMAS } from '../../data/dataTemplates';
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Download, HelpCircle } from 'lucide-react';

export default function CSVImportModal({ isOpen, onClose, targetType = 'incidents', onImportSuccess }) {
  const [csvText, setCsvText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const schema = CSV_SCHEMAS[targetType] || CSV_SCHEMAS.incidents;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setCsvText(text);
        processCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const processCSV = (text) => {
    try {
      const res = parseCSV(text);
      if (!res.rows || res.rows.length === 0) {
        setErrorMsg('No valid data rows found in CSV. Please verify column headers.');
        setParsedData(null);
        return;
      }
      setErrorMsg(null);
      setParsedData(res);
    } catch (err) {
      setErrorMsg(`Failed to parse CSV file: ${err.message}`);
      setParsedData(null);
    }
  };

  const handleLoadSample = () => {
    setCsvText(schema.sample);
    processCSV(schema.sample);
  };

  const handleCommit = () => {
    if (!parsedData || !parsedData.rows.length) return;
    onImportSuccess(targetType, parsedData.rows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">Import {targetType} Dataset</h3>
              <p className="text-xs text-slate-400">Upload CSV file or paste raw table data</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Expected Column Headers:</span>
            <button
              onClick={handleLoadSample}
              className="text-cyan-400 hover:underline font-bold text-[11px]"
            >
              Load Sample CSV Template
            </button>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
            {schema.headers.join(', ')}
          </div>

          {/* Drag & Drop or Browse */}
          <div className="p-6 border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl text-center space-y-2 bg-slate-950/40 transition-colors">
            <Upload className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-xs font-semibold text-slate-200">
              Choose a .csv file from your computer
            </div>
            <label className="cursor-pointer inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors">
              Browse Files
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Raw Text Paste Alternative */}
        <div className="space-y-1 text-xs">
          <label className="text-slate-400">Or Paste CSV Content:</label>
          <textarea
            rows="3"
            value={csvText}
            onChange={(e) => {
              setCsvText(e.target.value);
              processCSV(e.target.value);
            }}
            placeholder="paste csv rows here..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Data Preview */}
        {parsedData && (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Validated {parsedData.rows.length} Records</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">{parsedData.headers.length} Columns Matched</span>
            </div>

            <div className="max-h-36 overflow-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    {parsedData.headers.map((h, i) => (
                      <th key={i} className="p-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parsedData.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} className="text-slate-300">
                      {parsedData.headers.map((h, j) => (
                        <td key={j} className="p-2 truncate max-w-xs">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedData.rows.length > 5 && (
              <span className="text-[10px] text-slate-500 block text-right font-mono">
                + {parsedData.rows.length - 5} more records ready for import
              </span>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCommit}
            disabled={!parsedData || parsedData.rows.length === 0}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow"
          >
            Import {parsedData ? `${parsedData.rows.length} Records` : 'Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
