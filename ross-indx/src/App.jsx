import './index.css';
import { useState } from 'react';
import DiagnosticPage from './components/DiagnosticPage';
import IndiaDiagnosticPage from './components/IndiaDiagnosticPage';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [diagnosticType, setDiagnosticType] = useState('gulf');

  if (currentView === 'dashboard') {
    return (
      <Dashboard 
        onStartDiagnostic={(type) => {
          setDiagnosticType(type);
          setCurrentView('diagnostic');
        }} 
      />
    );
  }

  if (diagnosticType === 'india') {
    return <IndiaDiagnosticPage onBack={() => setCurrentView('dashboard')} />;
  }

  return <DiagnosticPage onBack={() => setCurrentView('dashboard')} />;
}
