import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  UploadCloud, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  LocateFixed,
  Sparkles,
  Info
} from 'lucide-react';
import { CATEGORIES, SAMPLE_PRESET_IMAGES } from '../data/mockHazards';

export default function ReportModal({ isOpen, onClose, onSubmitReport, initialCoords }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
    severity: 'critical',
    address: '',
    ward: 'Central Zone - Ward 101',
    lat: 12.9716,
    lng: 77.5946,
    imageUrl: SAMPLE_PRESET_IMAGES[0].url,
    reportedBy: 'Concerned Citizen',
    isAnonymous: false
  });

  const [imagePreview, setImagePreview] = useState(SAMPLE_PRESET_IMAGES[0].url);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialCoords && initialCoords.lat && initialCoords.lng) {
      setFormData((prev) => ({
        ...prev,
        lat: Number(initialCoords.lat.toFixed(5)),
        lng: Number(initialCoords.lng.toFixed(5)),
        address: prev.address || `Near Lat ${initialCoords.lat.toFixed(4)}, Lng ${initialCoords.lng.toFixed(4)}`
      }));
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if ('geolocation' in navigator) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData((prev) => ({
            ...prev,
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            address: prev.address || 'Detected GPS Location'
          }));
          setIsDetectingLocation(false);
        },
        () => {
          setIsDetectingLocation(false);
          alert('Could not access GPS. Please enter location manually or click on map.');
        }
      );
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Please enter a title for the hazard.';
    if (!formData.address.trim()) newErrors.address = 'Please specify the road address or landmark.';
    if (!formData.description.trim()) newErrors.description = 'Please provide brief details.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmitReport({
      ...formData,
      reportedBy: formData.isAnonymous ? 'Anonymous Commuter' : formData.reportedBy,
      reportedAt: new Date().toISOString(),
      upvotes: 1,
      truthScore: 100,
      status: 'reported',
      timeline: [
        {
          date: 'Just now',
          user: formData.isAnonymous ? 'Anonymous' : formData.reportedBy,
          action: 'Reported hazard on RoadTruth'
        }
      ]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Report Road Truth</h2>
              <p className="text-xs text-slate-400">Submit crowdsourced evidence to alert motorists & pressure civic authorities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Hazard Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Massive Crater Pothole causing tyre punctures"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Danger Severity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'critical', label: '🔴 Critical', color: 'hover:border-red-500' },
                  { id: 'moderate', label: '🟡 Moderate', color: 'hover:border-amber-500' },
                  { id: 'low', label: '🔵 Low Risk', color: 'hover:border-blue-500' }
                ].map((sev) => (
                  <button
                    type="button"
                    key={sev.id}
                    onClick={() => setFormData({ ...formData, severity: sev.id })}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                      formData.severity === sev.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                        : `bg-slate-950 border-slate-800 text-slate-400 ${sev.color}`
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Exact Location & Road <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={handleDetectGPS}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                {isDetectingLocation ? 'Detecting...' : 'Use Current GPS'}
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. 100 Feet Road, near 12th Main intersection"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Ward / Zone Area</label>
                <input
                  type="text"
                  placeholder="e.g. East Zone - Ward 82"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 text-[11px] block mb-1">Coordinates (Lat, Lng)</label>
                <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-mono text-[11px]">
                  {formData.lat}, {formData.lng}
                </div>
              </div>
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Photo Evidence
            </label>
            
            {/* Image Preview & Upload Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preview Box */}
              <div className="relative h-36 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-700" />
                )}
                <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-slate-300">
                  Evidence Preview
                </span>
              </div>

              {/* Upload Input & Sample chips */}
              <div className="flex flex-col justify-between space-y-2">
                <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50">
                  <UploadCloud className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-xs font-semibold text-slate-200">Upload Device Photo</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Preset Chips */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Or pick quick sample:</span>
                  <div className="flex flex-wrap gap-1">
                    {SAMPLE_PRESET_IMAGES.map((sample, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setImagePreview(sample.url);
                          setFormData((prev) => ({ ...prev, imageUrl: sample.url }));
                        }}
                        className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Hazard Details & Impact <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe depth, hazard visibility at night, traffic blockage, or accidents seen..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Reporter details */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anon"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
              />
              <label htmlFor="anon" className="text-xs text-slate-300 cursor-pointer">
                Post anonymously
              </label>
            </div>
            {!formData.isAnonymous && (
              <input
                type="text"
                placeholder="Your Name (optional)"
                value={formData.reportedBy}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
              />
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              Publish Road Truth
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
