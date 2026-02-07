import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard, Leads, Campaigns, Settings } from './pages';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0c] text-slate-200 selection:bg-indigo-500/30">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(50,50,80,0.15),transparent_50%)] pointer-events-none" />
        <Navbar />
        <main className="container mx-auto px-4 py-8 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
