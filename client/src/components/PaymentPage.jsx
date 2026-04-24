import { Check, ShieldCheck } from 'lucide-react';

export default function PaymentPage({ businessName, onBack }) {
  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '24px' }}
      >
        ← Back to Demo
      </button>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px' }}>
          Activate <span style={{ color: 'var(--accent-primary)' }}>{businessName || 'Your System'}</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Your AI Growth System is ready. Choose a plan to launch immediately.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* Starter Plan */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Starter</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Perfect for testing the waters.</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            ₹2,999<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Up to 500 leads/mo</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Standard Landing Page</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Basic Chatbot</li>
          </ul>
          <button className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--accent-primary)' }}>Select Starter</button>
        </div>

        {/* Pro Plan */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '300px', padding: '32px', display: 'flex', flexDirection: 'column', border: '1px solid var(--accent-primary)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            RECOMMENDED
          </div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Growth Pro</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Full automation for serious scaling.</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
            ₹7,499<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/mo</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Unlimited Leads</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> AI Contextual Chatbot</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Advanced CRM Integration</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18} color="var(--success)" /> Priority Support</li>
          </ul>
          <button className="btn-primary" style={{ width: '100%' }}>Proceed to Checkout</button>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <ShieldCheck size={18} /> Secure 256-bit encrypted checkout via Stripe / Razorpay
      </div>
    </div>
  );
}
