import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../components/PageWrapper';
import { NeonButton } from '../components/NeonButton';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const ProInput = ({ label, name, value, onChange, placeholder, type = "text" }) => {
  return (
    <div className="space-y-1 w-full">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-sm font-bold text-[var(--text-primary)] placeholder:text-gray-400/50"
      />
    </div>
  );
};

export default function ProfileDetails() {
  const navigate = useNavigate();
  const { user, setAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'male',
    age: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.age || !formData.city || !formData.pincode) {
        return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    setAuthenticated({ 
        ...user, 
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        profile: formData 
    });
    
    setLoading(false);
    navigate('/rider/onboarding'); // Go to KYC
  };

  return (
    <PageWrapper className={`flex flex-col px-6 pt-12 pb-10 transition-colors duration-500 overflow-y-auto no-scrollbar ${
      isDark ? 'bg-[#0A0A0F]' : 'bg-slate-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <span className="text-flexigo-teal font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Step 2: Profile</span>
        <h1 className={`text-3xl font-heading font-black transition-colors duration-500 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>Setup Profile</h1>
        <p className={`text-sm mt-2 transition-colors duration-500 ${
          isDark ? 'text-gray-500' : 'text-slate-500'
        }`}>Tell us a bit about yourself to get started.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1"
      >
        <div className={`overflow-hidden rounded-2xl border ${
          isDark ? 'border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40' : 'border-slate-200 bg-white shadow-xl shadow-slate-200/40'
        }`}>
          <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
            <div className="p-4 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <ProInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
            </div>
            <div className="p-4 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <ProInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>

          <div className="p-4 border-b border-[var(--border-subtle)] focus-within:bg-flexigo-teal/[0.02] transition-colors">
             <ProInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
          </div>

          <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
            <div className="p-4 space-y-1 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Gender</label>
               <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-transparent border-none outline-none text-sm font-bold text-[var(--text-primary)]">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
               </select>
            </div>
            <div className="p-4 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <ProInput label="Age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter age" />
            </div>
          </div>

          <div className="p-4 border-b border-[var(--border-subtle)] focus-within:bg-flexigo-teal/[0.02] transition-colors">
             <ProInput label="Permanent Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street name, landmark..." />
          </div>

          <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)]">
            <div className="p-4 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <ProInput label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Bengaluru" />
            </div>
            <div className="p-4 focus-within:bg-flexigo-teal/[0.02] transition-colors">
               <ProInput label="Pincode" type="number" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="560 000" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10">
        <NeonButton
          size="full"
          variant="solid"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Saving details...' : 'Continue to KYC →'}
        </NeonButton>
      </div>
    </PageWrapper>
  );
}
