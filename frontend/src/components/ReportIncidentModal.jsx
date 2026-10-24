import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Hammer, 
  Droplets, 
  AlertOctagon, 
  LightbulbOff, 
  ShieldAlert, 
  CloudRain, 
  HelpCircle,
  MapPin, 
  Camera, 
  UploadCloud, 
  CheckCircle2,
  LocateFixed
} from 'lucide-react';
import { INCIDENT_TYPES } from '../data/roadTruthData';

export default function ReportIncidentModal({ isOpen, onClose, onSubmitIncident }) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('accident');
  const [locationText, setLocationText] = useState('12.8335, 74.8584 (Thokkottu, Mangaluru)');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=600&q=80');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGPSDetect = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationText(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} (GPS Confirmed)`);
        },
        () => {
          setLocationText('12.8700, 74.8450 (Mangaluru City Center)');
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitIncident) {
      onSubmitIncident({
        id: `inc-${Date.now()}`,
        title: `${selectedType.toUpperCase().replace('_', ' ')} Alert`,
        location: locationText,
        lat: 12.8700,
        lng: 74.8450,
        distance: 'Nearby',
        delay: '15-20 min',
        type: selectedType,
        verified: true,
        verificationPct: 88,
        reportedAgo: 'Just now',
        updatedAgo: 'Just now',
        estimatedClearance: '30 minutes',
        cause: description || 'Reported via RoadTruth Citizen Portal',
        affectedStretch: '500m',
        reportedBy: 'You (Citizen Sentinel)',
        trustScore: 88,
        confidenceLevel: 'High Confidence',
        checkpoints: [
          { label: 'GPS location confirmed', verified: true },
          { label: 'User report verified', verified: true },
          { label: 'Photo evidence attached', verified: true }
        ],
        imageUrl: photoPreview,
        description: description || 'Hazard actively blocking traffic flow.'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        {/* Header matching design */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Report a Road Problem</h3>
            <p className="text-xs text-slate-400">Crowdsource real-time hazard intelligence</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper matching design: 1 Select Type -> 2 Add Details -> 3 Submit */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] border border-cyan-500/40">1</span>
            <span>Select Type</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[11px]">2</span>
            <span>Add Details</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[11px]">3</span>
            <span>Submit</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 8 Type Selection Grid matching design */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select Incident Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'accident', label: 'Accident', icon: AlertTriangle, color: 'text-red-400' },
                { id: 'road_repair', label: 'Road Repair', icon: Hammer, color: 'text-amber-400' },
                { id: 'flooding', label: 'Flooding', icon: Droplets, color: 'text-blue-400' },
                { id: 'pothole', label: 'Pothole', icon: AlertOctagon, color: 'text-purple-400' },
                { id: 'signal_failure', label: 'Signal Failure', icon: LightbulbOff, color: 'text-pink-400' },
                { id: 'road_closure', label: 'Road Closure', icon: ShieldAlert, color: 'text-slate-300' },
                { id: 'heavy_rain', label: 'Heavy Rain', icon: CloudRain, color: 'text-cyan-400' },
                { id: 'other', label: 'Other', icon: HelpCircle, color: 'text-slate-400' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = selectedType === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedType(item.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                      isSelected 
                        ? 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/20 text-white' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-[10px] font-bold text-center leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location field with Auto-detect */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Location (Auto-detected)
              </label>
              <button
                type="button"
                onClick={handleGPSDetect}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <LocateFixed className="w-3 h-3" /> Detect GPS
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Photo / Video evidence preview matching design */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Add Photo / Video (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-cyan-400/50 rounded-2xl p-3 flex items-center justify-center gap-2 cursor-pointer bg-slate-950/60 transition-colors">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-300">Tap to upload proof</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {photoPreview && (
                <div className="w-16 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                  <img src={photoPreview} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Incident Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 2 lanes blocked, severe tailback forming..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
