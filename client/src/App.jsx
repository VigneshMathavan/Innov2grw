import { useState, useEffect } from 'react';
import Form from './components/Form';
import DemoDashboard from './components/DemoDashboard';
import PaymentPage from './components/PaymentPage';
import AIConsultant from './components/AIConsultant';
import { Terminal, X, AlertTriangle } from 'lucide-react';
import { API_URL } from './config';

const AI_THOUGHTS = [
  "Initializing Gemini 2.5 Flash model...",
  "Analyzing business context and industry...",
  "Generating customized landing page copy...",
  "Structuring CRM mock data...",
  "Finalizing presentation..."
];

function App() {
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [showPayload, setShowPayload] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    let interval;
    if (loading) {
      setThoughtIndex(0);
      interval = setInterval(() => {
        setThoughtIndex(prev => (prev < AI_THOUGHTS.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (formData) => {
    setLoading(true);
    setError('');
    setShowPayment(false); // Reset payment view if generating again
    try {
      const response = await fetch(`${API_URL}/api/generate-demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate demo');
      }
      
      const data = await response.json();
      // Store original business name and goal for checkout/routing
      data.businessName = formData.businessName || formData.businessType;
      data.goal = formData.goal;
      setDemoData(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>
          Innov2Grow <span style={{ color: 'var(--accent-primary)' }}>AI System</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          See your personalized AI growth system in 60 seconds.
        </p>
      </header>

      {!demoData && !loading && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Form onSubmit={handleGenerate} />
          {error && <p style={{ color: 'var(--warning)', marginTop: '16px', textAlign: 'center' }}>{error}</p>}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }} className="animate-fade-in">
          <div className="loading-pulse" style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '16px' }}>AI is thinking...</h2>
          <div style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontStyle: 'italic', height: '24px' }}>
            {AI_THOUGHTS[thoughtIndex]}
          </div>
        </div>
      )}

      {demoData && !loading && showPayment && (
        <PaymentPage businessName={demoData.businessName} onBack={() => setShowPayment(false)} />
      )}

      {demoData && !loading && !showPayment && (
        <div className="animate-fade-in">
          
          {demoData.isFallback && (
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', color: 'var(--warning)', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={24} />
              <div>
                <strong>Notice: AI Fallback Activated.</strong> The backend Gemini API key is missing or failed, so the system instantly fell back to static templated data to ensure the demo still loads under 5 seconds.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowPayload(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <Terminal size={18} /> View AI Payload (For Recruiters)
            </button>
          </div>

          <DemoDashboard data={demoData.data} goal={demoData.goal} />
          
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="btn-primary" onClick={() => setDemoData(null)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', marginRight: '16px' }}>
              Start Over
            </button>
            <button className="btn-primary" onClick={() => setShowPayment(true)}>
              Activate This System
            </button>
          </div>
        </div>
      )}

      {/* AI Payload Modal */}
      {showPayload && demoData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><Terminal size={20} /> AI Developer Payload</h3>
              <button onClick={() => setShowPayload(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px' }}>1. Prompt Sent to Gemini 2.5 Flash</h4>
              <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '24px' }}>
                {demoData.prompt}
              </pre>

              <h4 style={{ color: 'var(--success)', marginBottom: '8px' }}>2. JSON Response Received</h4>
              <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.85rem', color: '#86efac' }}>
                {JSON.stringify(demoData.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {demoData && !loading && (
        <AIConsultant businessName={demoData.businessName} businessType={demoData.businessType} />
      )}

    </div>
  );
}

export default App;
