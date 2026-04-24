import { useState } from 'react';
import { Building2, Target, MessageSquare, Rocket } from 'lucide-react';

export default function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    businessType: 'Retail',
    goal: 'Lead Generation',
    channel: 'WhatsApp',
    businessName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            <Building2 size={18} /> Business Type
          </label>
          <select name="businessType" value={formData.businessType} onChange={handleChange}>
            <option value="Retail">Retail</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Education">Education</option>
            <option value="Services">Services</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            <Target size={18} /> Primary Goal
          </label>
          <select name="goal" value={formData.goal} onChange={handleChange}>
            <option value="Lead Generation">Lead Generation</option>
            <option value="Customer Retention">Customer Retention</option>
            <option value="Sales Automation">Sales Automation</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            <MessageSquare size={18} /> Preferred Channel
          </label>
          <select name="channel" value={formData.channel} onChange={handleChange}>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Instagram">Instagram</option>
            <option value="Website">Website Chat</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
            Business Name (Optional)
          </label>
          <input 
            type="text" 
            name="businessName" 
            placeholder="e.g. Ramesh Clothing Store"
            value={formData.businessName} 
            onChange={handleChange} 
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <Rocket size={18} /> Generate My Demo
        </button>

      </form>
    </div>
  );
}
