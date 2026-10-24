import React, { useState } from 'react';
import { useRouteWise } from '../../context/RouteWiseContext';
import { AlertOctagon, PhoneCall, ShieldCheck, X, AlertTriangle, Users, CheckCircle, Plus, Trash2 } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose }) {
  const context = useRouteWise() || {};
  const { 
    sosActive = false,
    sosState = { isActive: false }, 
    triggerSOS = () => {}, 
    cancelSOS = () => {}, 
    emergencyContacts = [], 
    addEmergencyContact = () => {}, 
    deleteEmergencyContact = () => {} 
  } = context;

  const isSosActive = Boolean(sosState?.isActive || sosActive);

  const [confirmStep, setConfirmStep] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen && !isSosActive) return null;

  const handleStartSOS = () => {
    setConfirmStep(false);
    triggerSOS();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    addEmergencyContact({
      name: newContactName,
      phone: newContactPhone,
      relation: newContactRelation || 'Emergency Contact'
    });
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelation('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isSosActive ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-red-500/10 text-red-400'}`}>
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">RouteWise Emergency SOS</h3>
              <p className="text-xs text-slate-400">Simulated traveler safety protocol</p>
            </div>
          </div>
          {!isSosActive && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 leading-relaxed flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>
            <strong>Demo Safety Notice:</strong> This is an interactive frontend demonstration. Activating SOS does NOT dispatch real police, 112/911 emergency services, or real telemetry.
          </span>
        </div>

        {/* ACTIVE SOS STATE */}
        {isSosActive ? (
          <div className="mt-6 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-400 animate-ping">
              <AlertOctagon className="w-10 h-10" />
            </div>
            <div>
              <div className="text-sm font-bold text-red-400 uppercase tracking-wider">Simulated SOS Active</div>
              <h4 className="text-xl font-black text-white mt-1">Live Location Beacon Broadcasted</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Simulated high-priority ping dispatched to configured emergency contacts and employer transit desk.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl text-left space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Notified ICE Contacts (Simulated):</div>
              {(emergencyContacts || []).map(c => (
                <div key={c.id} className="flex justify-between items-center text-slate-300 py-1 border-b border-slate-800/60 last:border-0">
                  <span className="font-medium">{c.name} ({c.relation})</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> SMS Dispatched
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={cancelSOS}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-colors shadow-lg"
            >
              Stand Down / Cancel Simulated SOS
            </button>
          </div>
        ) : (
          /* INACTIVE / TRIGGER DIALOG */
          <div className="mt-5 space-y-5">
            {!confirmStep ? (
              <>
                <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl space-y-2">
                  <h4 className="text-sm font-semibold text-slate-200">What happens when you trigger SOS?</h4>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>Broadcasts mock high-priority telemetry to employer operations.</li>
                    <li>Notifies your configured In Case of Emergency (ICE) contacts.</li>
                    <li>Elevates route priority to bypass dangerous hazard zones.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setConfirmStep(true)}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertOctagon className="w-5 h-5" />
                    <span>Trigger Simulated Distress Signal</span>
                  </button>

                  <div className="flex gap-2">
                    <a
                      href="tel:112"
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-cyan-400" />
                      <span>Dial National Emergency (112)</span>
                    </a>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>ICE Contacts</span>
                    </button>
                  </div>
                </div>

                {/* ICE Contacts List / Management */}
                {showAddForm && (
                  <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Emergency Contacts</span>
                      <span className="text-[10px] text-slate-500">{emergencyContacts.length} configured</span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {(emergencyContacts || []).map(contact => (
                        <div key={contact.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs">
                          <div>
                            <div className="font-semibold text-slate-200">{contact.name}</div>
                            <div className="text-[10px] text-slate-400">{contact.phone} • {contact.relation}</div>
                          </div>
                          <button
                            onClick={() => deleteEmergencyContact(contact.id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Contact Mini-Form */}
                    <form onSubmit={handleAddSubmit} className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Contact Name"
                          value={newContactName}
                          onChange={e => setNewContactName(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={newContactPhone}
                          onChange={e => setNewContactPhone(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Relationship (e.g. Spouse, Manager)"
                          value={newContactRelation}
                          onChange={e => setNewContactRelation(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            ) : (
              /* Confirmation Step */
              <div className="space-y-4 text-center py-2">
                <AlertOctagon className="w-12 h-12 text-red-400 mx-auto animate-bounce" />
                <div>
                  <h4 className="text-base font-bold text-white">Confirm Simulated Emergency SOS?</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    This will activate the simulated emergency beacon and update your live transit status in the demonstration environment.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmStep(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartSOS}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                  >
                    Yes, Broadcast SOS
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
