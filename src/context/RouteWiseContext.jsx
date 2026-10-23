import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SEED_INCIDENTS, 
  SEED_EMPLOYEES, 
  SEED_ROUTES, 
  SEED_JOURNEYS 
} from '../data/dataTemplates';

const RouteWiseContext = createContext(null);

export const useRouteWise = () => {
  const ctx = useContext(RouteWiseContext);
  if (!ctx) throw new Error('useRouteWise must be used within RouteWiseProvider');
  return ctx;
};

export const RouteWiseProvider = ({ children }) => {
  // 1. Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('routewise_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('routewise_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // 2. Role State: 'passenger' | 'employer' | 'authority' | 'admin'
  const [role, setRoleState] = useState(() => localStorage.getItem('routewise_role') || 'passenger');

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem('routewise_role', newRole);
  };

  // 3. Toast System
  const [toasts, setToasts] = useState([]);
  const showToast = (title, message = '', type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 4. Incidents State (persisted, user-editable)
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('routewise_incidents');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('routewise_incidents', JSON.stringify(incidents));
  }, [incidents]);

  const addIncident = (data) => {
    const newInc = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      title: data.title || `${(data.category || 'hazard').toUpperCase()} Reported`,
      category: data.category || 'other',
      severity: data.severity || 'moderate',
      locationName: data.locationName || 'Coastal NH-66 Corridor',
      lat: Number(data.lat) || 12.8756,
      lng: Number(data.lng) || 74.8628,
      reportedAgo: 'Just now',
      timestamp: new Date().toISOString(),
      delayMinutes: Number(data.delayMinutes) || 15,
      affectedDistanceKm: Number(data.affectedDistanceKm) || 1.2,
      description: data.description || 'Community incident report submitted.',
      imageUrl: data.imageUrl || null,
      verificationLevel: data.imageUrl ? 5 : (data.lat ? 2 : 1),
      confirmationCount: 1,
      status: 'active',
      evidence: {
        hasGpsLocation: !!data.lat,
        userReportCount: 1,
        hasMedia: !!data.imageUrl,
        avgSpeedKmh: 6.0,
        normalSpeedKmh: 45.0,
        authorityConfirmed: false
      },
      alternativeRoute: 'Alternative diversion calculated by route planner.'
    };

    setIncidents(prev => [newInc, ...prev]);
    showToast('Report Published', 'Incident logged into RouteWise verification workflow.', 'success');
    return newInc;
  };

  const confirmIncident = (id) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const newCount = (inc.confirmationCount || 1) + 1;
        const newLvl = newCount >= 3 && inc.verificationLevel < 3 ? 3 : inc.verificationLevel;
        return {
          ...inc,
          confirmationCount: newCount,
          verificationLevel: newLvl,
          evidence: {
            ...inc.evidence,
            userReportCount: newCount
          }
        };
      }
      return inc;
    }));
    showToast('Incident Confirmed', 'Your confirmation corroborated this road problem.', 'success');
  };

  const resolveIncident = (id) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'cleared' } : inc));
    showToast('Incident Cleared', 'Marked resolved on the traffic grid.', 'info');
  };

  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    showToast('Incident Removed', '', 'info');
  };

  // 5. Employees State (persisted, user-editable)
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('routewise_employees');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem('routewise_employees', JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (emp) => {
    const newEmp = {
      id: emp.id || `EMP-${Math.floor(110 + Math.random() * 880)}`,
      name: emp.name || 'New Staff Member',
      department: emp.department || 'Engineering',
      role: emp.role || 'Specialist',
      route: emp.route || 'Ullal – Mangaluru',
      origin: emp.origin || 'City Center',
      scheduledArrival: emp.scheduledArrival || '09:00 AM',
      estimatedArrival: emp.estimatedArrival || '09:00 AM',
      estimatedDelayMin: Number(emp.estimatedDelayMin) || 0,
      journeyStatus: Number(emp.estimatedDelayMin) > 0 ? 'delayed' : 'on_schedule',
      incidentAffected: emp.incidentAffected || (Number(emp.estimatedDelayMin) > 0 ? 'Corridor Delay' : 'None'),
      verificationStatus: Number(emp.estimatedDelayMin) > 0 ? 'Level 4 (Telemetry Verified)' : 'Normal Flow',
      consentGranted: emp.consentGranted !== false,
      evidenceApproved: Number(emp.estimatedDelayMin) > 0,
      delayCertificateId: Number(emp.estimatedDelayMin) > 0 ? `CERT-${Date.now().toString().slice(-4)}` : null,
      hrNotes: emp.hrNotes || 'Verified via commute telemetry.'
    };
    setEmployees(prev => [newEmp, ...prev]);
    showToast('Employee Added', `${newEmp.name} registered in commute roster.`, 'success');
  };

  const updateEmployee = (id, fields) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e));
    showToast('Employee Updated', 'Changes saved to roster.', 'success');
  };

  const deleteEmployee = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    showToast('Employee Removed', 'Removed from roster.', 'info');
  };

  // 6. Routes & Active Journey State
  const [routes] = useState(SEED_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(SEED_ROUTES[0]);

  const [activeJourney, setActiveJourney] = useState(() => {
    const saved = localStorage.getItem('routewise_active_journey');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      isActive: false,
      isPaused: false,
      progress: 0,
      origin: 'Surathkal Town',
      destination: 'Hampankatta City Center',
      currentRoute: SEED_ROUTES[0],
      startTime: null,
      currentDelayMin: 12,
      speedKmh: 42,
      distanceRemainingKm: 34.2
    };
  });

  useEffect(() => {
    localStorage.setItem('routewise_active_journey', JSON.stringify(activeJourney));
  }, [activeJourney]);

  // Simulated live journey progression
  useEffect(() => {
    if (!activeJourney.isActive || activeJourney.isPaused) return;

    const timer = setInterval(() => {
      setActiveJourney(prev => {
        if (!prev.isActive || prev.isPaused) return prev;
        const nextProgress = Math.min(100, prev.progress + 2);
        const distanceRemaining = Math.max(0, +(prev.currentRoute.distanceKm * (1 - nextProgress / 100)).toFixed(1));
        const simulatedSpeed = nextProgress > 60 && nextProgress < 85 ? 12 : Math.floor(38 + Math.random() * 16);

        if (nextProgress >= 100) {
          return {
            ...prev,
            progress: 100,
            distanceRemainingKm: 0,
            speedKmh: 0,
            isActive: false
          };
        }

        return {
          ...prev,
          progress: nextProgress,
          distanceRemainingKm: distanceRemaining,
          speedKmh: simulatedSpeed
        };
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [activeJourney.isActive, activeJourney.isPaused]);

  // 7. Journey History
  const [journeyHistory, setJourneyHistory] = useState(() => {
    const saved = localStorage.getItem('routewise_journey_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_JOURNEYS;
  });

  useEffect(() => {
    localStorage.setItem('routewise_journey_history', JSON.stringify(journeyHistory));
  }, [journeyHistory]);

  const startJourney = (route = selectedRoute, origin = 'Surathkal Town', destination = 'Hampankatta') => {
    setActiveJourney({
      isActive: true,
      isPaused: false,
      progress: 4,
      origin,
      destination,
      currentRoute: route,
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      currentDelayMin: route.delayMin || 8,
      speedKmh: 45,
      distanceRemainingKm: route.distanceKm
    });
    showToast('Journey Started', `Active commute tracking engaged on ${route.name}`, 'success');
  };

  const pauseJourney = () => {
    setActiveJourney(prev => ({ ...prev, isPaused: !prev.isPaused }));
    showToast(activeJourney.isPaused ? 'Journey Resumed' : 'Journey Paused', '', 'info');
  };

  const endJourney = () => {
    const newEntry = {
      id: `jrn-${Date.now().toString().slice(-4)}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      origin: activeJourney.origin,
      destination: activeJourney.destination,
      routeUsed: activeJourney.currentRoute.name,
      durationMin: activeJourney.currentRoute.currentDurationMin || 48,
      typicalMin: activeJourney.currentRoute.typicalDurationMin || 42,
      delayMin: activeJourney.currentDelayMin,
      status: 'Completed',
      savedMinWithAlternative: 14
    };

    setJourneyHistory(prev => [newEntry, ...prev]);
    setActiveJourney({
      isActive: false,
      isPaused: false,
      progress: 0,
      origin: 'Surathkal Town',
      destination: 'Hampankatta City Center',
      currentRoute: SEED_ROUTES[0],
      startTime: null,
      currentDelayMin: 0,
      speedKmh: 0,
      distanceRemainingKm: 0
    });
    showToast('Journey Ended', 'Trip saved to your Journey History. Verified delay proof stored.', 'success');
  };

  // 8. Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('routewise_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'notif-1', title: 'Thokkottu Collision Delay', message: '+28m delay reported on southbound NH-66.', time: '15m ago', read: false },
      { id: 'notif-2', title: 'Commute Waiver Generated', message: 'Delay certificate #CERT-8812 recorded for attendance.', time: '1h ago', read: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('routewise_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('Notifications Marked Read', '', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications Cleared', '', 'info');
  };

  // 9. Emergency SOS State
  const [sosActive, setSosActive] = useState(false);
  const sosState = {
    isActive: sosActive,
    active: sosActive,
    timestamp: sosActive ? new Date().toISOString() : null
  };

  const triggerSOS = () => {
    setSosActive(true);
    showToast('DEMO SOS ACTIVATED', 'Simulated emergency state active. Cancel if accidental.', 'warning');
  };
  const cancelSOS = () => {
    setSosActive(false);
    showToast('SOS Stand Down', 'Simulated emergency broadcast safely cancelled.', 'info');
  };

  // Emergency Contacts (ICE)
  const [emergencyContacts, setEmergencyContacts] = useState(() => {
    const saved = localStorage.getItem('routewise_emergency_contacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'ec-1', name: 'Primary ICE (Family)', phone: '+91 98765 43210', relation: 'Spouse' },
      { id: 'ec-2', name: 'Work Transit Coordinator', phone: '+91 91234 56789', relation: 'Employer Ops' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('routewise_emergency_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  const addEmergencyContact = (contact) => {
    const newContact = { id: `ec-${Date.now()}`, ...contact };
    setEmergencyContacts(prev => [...prev, newContact]);
    showToast('Contact Added', `${contact.name} saved to emergency contacts.`, 'success');
  };

  const deleteEmergencyContact = (id) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
    showToast('Contact Removed', 'Emergency contact deleted.', 'info');
  };

  // 10. Privacy & Consent Settings
  const [privacySettings, setPrivacySettings] = useState(() => {
    const saved = localStorage.getItem('routewise_privacy');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      isSharingCommute: true,
      sharingPolicy: 'active_commute',
      retentionDays: 7,
      allowLocation: true
    };
  });

  const updatePrivacySettings = (updates) => {
    setPrivacySettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('routewise_privacy', JSON.stringify(next));
      return next;
    });
    showToast('Settings Saved', 'Consent rules updated.', 'success');
  };

  // 11. CSV Dataset Import Logic
  const importDataset = (type, rows) => {
    if (type === 'incidents') {
      const formatted = rows.map((r, i) => ({
        id: `inc-imp-${Date.now().toString().slice(-4)}-${i}`,
        title: r.title || 'Imported Incident',
        category: r.category || 'other',
        severity: r.severity || 'moderate',
        locationName: r.locationName || 'Imported Location',
        lat: Number(r.lat) || 12.8756,
        lng: Number(r.lng) || 74.8628,
        reportedAgo: 'Recently imported',
        timestamp: new Date().toISOString(),
        delayMinutes: Number(r.delayMinutes) || 15,
        affectedDistanceKm: 1.2,
        description: r.description || 'Imported from CSV dataset',
        verificationLevel: Number(r.verificationLevel) || 3,
        confirmationCount: 3,
        status: 'active',
        evidence: { hasGpsLocation: true, userReportCount: 3, hasMedia: false, avgSpeedKmh: 8, normalSpeedKmh: 45, authorityConfirmed: false },
        alternativeRoute: 'Alternate route advised.'
      }));
      setIncidents(prev => [...formatted, ...prev]);
      showToast('Data Imported', `Added ${formatted.length} incidents to live telemetry.`, 'success');
    } else if (type === 'employees') {
      const formatted = rows.map((r, i) => ({
        id: r.id || `EMP-IMP-${i + 1}`,
        name: r.name || 'Imported Employee',
        department: r.department || 'Operations',
        role: r.role || 'Staff',
        route: r.route || 'Mangaluru – Udupi',
        origin: r.origin || 'City Center',
        scheduledArrival: r.scheduledArrival || '09:00 AM',
        estimatedArrival: r.scheduledArrival || '09:00 AM',
        estimatedDelayMin: Number(r.estimatedDelayMin) || 0,
        journeyStatus: Number(r.estimatedDelayMin) > 0 ? 'delayed' : 'on_schedule',
        incidentAffected: r.incidentAffected || 'None',
        verificationStatus: Number(r.estimatedDelayMin) > 0 ? 'Level 4 (Telemetry Verified)' : 'Normal Flow',
        consentGranted: r.consentGranted !== 'false' && r.consentGranted !== false,
        evidenceApproved: Number(r.estimatedDelayMin) > 0,
        delayCertificateId: Number(r.estimatedDelayMin) > 0 ? `CERT-${Date.now().toString().slice(-4)}` : null,
        hrNotes: 'Imported via CSV roster.'
      }));
      setEmployees(prev => [...formatted, ...prev]);
      showToast('Data Imported', `Added ${formatted.length} employees to commute roster.`, 'success');
    } else if (type === 'journeys') {
      const formatted = rows.map((r, i) => ({
        id: `jrn-imp-${i + 1}`,
        date: 'Imported Record',
        origin: r.origin || 'Origin Hub',
        destination: r.destination || 'Destination Hub',
        routeUsed: r.routeUsed || 'Coastal Corridor',
        durationMin: Number(r.durationMin) || 45,
        typicalMin: 40,
        delayMin: Number(r.delayMin) || 5,
        status: r.status || 'Completed',
        savedMinWithAlternative: Number(r.savedMinWithAlternative) || 0
      }));
      setJourneyHistory(prev => [...formatted, ...prev]);
      showToast('Data Imported', `Added ${formatted.length} trips to journey history.`, 'success');
    }
  };

  // 12. Clear All Data (To experience clean empty states)
  const clearAllData = () => {
    setIncidents([]);
    setEmployees([]);
    setJourneyHistory([]);
    setNotifications([]);
    localStorage.removeItem('routewise_incidents');
    localStorage.removeItem('routewise_employees');
    localStorage.removeItem('routewise_journey_history');
    localStorage.removeItem('routewise_notifications');
    showToast('Data Cleared', 'All datasets emptied. Experience clean empty states.', 'info');
  };

  // 13. Load Seed Data (To instantly test with project records)
  const loadSeedData = () => {
    setIncidents(SEED_INCIDENTS);
    setEmployees(SEED_EMPLOYEES);
    setJourneyHistory(SEED_JOURNEYS);
    showToast('Seed Data Loaded', 'Sample coastal corridor records populated.', 'success');
  };

  return (
    <RouteWiseContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        setRole,
        toasts,
        showToast,
        removeToast,
        incidents,
        addIncident,
        confirmIncident,
        resolveIncident,
        deleteIncident,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        routes,
        selectedRoute,
        setSelectedRoute,
        activeJourney,
        startJourney,
        pauseJourney,
        endJourney,
        journeyHistory,
        notifications,
        markAllNotificationsRead,
        clearNotifications,
        sosActive,
        sosState,
        triggerSOS,
        cancelSOS,
        emergencyContacts,
        addEmergencyContact,
        deleteEmergencyContact,
        privacySettings,
        updatePrivacySettings,
        importDataset,
        clearAllData,
        loadSeedData
      }}
    >
      {children}
    </RouteWiseContext.Provider>
  );
};
