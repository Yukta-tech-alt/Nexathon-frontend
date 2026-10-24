import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRouteWise } from '../../context/RouteWiseContext';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Video, 
  LocateFixed, 
  CheckCircle,
  X,
  Upload
} from 'lucide-react';

export default function IncidentReportForm({ onReportSubmitted = null }) {
  const navigate = useNavigate();
  const { addIncident, showToast } = useRouteWise();

  const [category, setCategory] = useState('accident');
  const [locationName, setLocationName] = useState('NH-66 Near Kottara Chowki, Mangaluru');
  const [lat, setLat] = useState(12.9056);
  const [lng, setLng] = useState(74.8384);
  const [delayMinutes, setDelayMinutes] = useState(15);
  const [photoName, setPhotoName] = useState(null);
  const [videoName, setVideoName] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'accident', label: 'Accident' },
    { id: 'flood', label: 'Flood' },
    { id: 'roadblock', label: 'Roadblock' },
    { id: 'construction', label: 'Construction' },
    { id: 'heavy_traffic', label: 'Heavy Traffic' },
    { id: 'other', label: 'Other' }
  ];

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation Unavailable', 'Location services not supported by browser', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocationName(`Near GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        showToast('Location Set', 'Using your GPS location', 'success');
      },
      (err) => {
        setIsLocating(false);
        showToast('Location Permission Denied', 'Please enter location manually.', 'info');
      },
      { timeout: 8000 }
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoName(file.name);
      showToast('Photo Attached', file.name, 'success');
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoName(file.name);
      showToast('Video Attached', file.name, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newInc = {
      title: `${category.toUpperCase().replace('_', ' ')}: ${locationName}`,
      category,
      severity: category === 'accident' || category === 'roadblock' ? 'severe' : 'moderate',
      locationName,
      lat,
      lng,
      delayMinutes,
      imageUrl: photoName ? 'https://images.unsplash.com/photo-1543393470-bce01e0a233b?auto=format&fit=crop&w=800&q=80' : null
    };

    addIncident(newInc);
    setSubmitted(true);
    showToast('Report Submitted', 'Your report has been logged.', 'success');

    if (onReportSubmitted) onReportSubmitted(newInc);
  };

  if (submitted) {
    return (
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Report Submitted</h3>
          <p className="text-xs text-slate-400 mt-1">
            Thank you. Your report is now available on the traffic map.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
          >
            Submit Another
          </button>
          <button
            onClick={() => navigate('/passenger')}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-xs font-bold rounded-xl text-slate-950 transition-colors"
          >
            View on Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6 text-slate-100">
      
      {/* Step 1: What happened? */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Step 1: What happened?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all border ${
                category === c.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Where? */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Step 2: Where?
          </label>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={isLocating}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold disabled:opacity-50"
          >
            <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
          </button>
        </div>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="e.g. NH-66 Thokkottu Junction"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Step 3: Evidence */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Step 3: Evidence (Optional)
        </label>
        <div className="grid grid-cols-2 gap-3">
          
          {/* Photo */}
          <label className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-semibold ${
            photoName ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}>
            <Camera className="w-4 h-4" />
            <span className="truncate">{photoName || 'Add Photo'}</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>

          {/* Video */}
          <label className={`p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-semibold ${
            videoName ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}>
            <Video className="w-4 h-4" />
            <span className="truncate">{videoName || 'Add Video'}</span>
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
          </label>

        </div>
      </div>

      {/* Step 4: Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
        >
          <span>Submit Report</span>
        </button>
      </div>

    </form>
  );
}
