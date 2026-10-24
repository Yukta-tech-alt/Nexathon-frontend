import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRouteWise } from '../context/RouteWiseContext';
import LiveTrafficMap from '../components/map/LiveTrafficMap';
import RoutePlannerBox from '../components/passenger/RoutePlannerBox';
import CommuteIntelligenceCard from '../components/passenger/CommuteIntelligenceCard';
import TrafficAlertsList from '../components/passenger/TrafficAlertsList';
import TrustScoreInspector from '../components/verification/TrustScoreInspector';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  Compass, 
  PlusCircle, 
  X,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import IncidentReportForm from '../components/incident/IncidentReportForm';

export default function PassengerDashboardPage() {
  const [searchParams] = useSearchParams();
  const { incidents, selectedRoute, showToast } = useRouteWise();

  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // If incidentId query param is passed, open that incident
  useEffect(() => {
    const incId = searchParams.get('incidentId');
    if (incId) {
      const found = incidents.find(i => i.id === incId);
      if (found) {
        setSelectedIncident(found);
      }
    }
  }, [searchParams, incidents]);

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    showToast(`Loaded: ${incident.title}`, `TrustScore: ${incident.trustScore}% (Level ${incident.verificationLevel})`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>Passenger Live Traffic & Commute Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time hazard alerts, 3-route optimization, and verified corridor telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left (Map + Commute Intelligence) | Right (Route Planner + Traffic Alerts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Live Traffic Map + Commute Intelligence */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Leaflet Map */}
          <LiveTrafficMap
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={handleSelectIncident}
            selectedRoute={selectedRoute}
            showFilters={true}
            height="520px"
            interactive={true}
          />

          {/* Commute Intelligence Card */}
          <CommuteIntelligenceCard selectedRoute={selectedRoute} />

          {/* TrustScore Inspector (Visible when an incident is selected) */}
          {selectedIncident && (
            <div id="inspector-section" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>Selected Incident Forensic Inspection</span>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-slate-400 hover:text-white"
                >
                  Close Inspector ✕
                </button>
              </div>
              <TrustScoreInspector 
                incident={selectedIncident} 
                onClose={() => setSelectedIncident(null)} 
              />
            </div>
          )}
        </div>

        {/* Right 5 Columns: Smart Route Optimizer + Live Roadway Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Route Planner Box */}
          <RoutePlannerBox />

          {/* Traffic Alerts List */}
          <TrafficAlertsList onSelectIncident={handleSelectIncident} />
        </div>
      </div>

      {/* Modal: Report an Incident Form */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <IncidentReportForm 
              onReportSubmitted={(newInc) => {
                setSelectedIncident(newInc);
                setIsReportModalOpen(false);
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
