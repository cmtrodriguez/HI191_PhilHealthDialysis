import { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Info,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDDRegistration, RecordStatus } from '../types';

interface RegistrationFormProps {
  onSubmit: (reg: PDDRegistration) => void;
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<Partial<PDDRegistration>>({
    regType: 'New Registration',
    memberType: 'Principal Member',
    sex: 'Male',
    patientName: { first: 'Juan', last: 'Dela Cruz', middle: 'P.', extension: '' },
    address: { unit: '', building: '', lot: '', street: '', subdivision: '', barangay: '', city: '', province: '', country: 'Philippines', zip: '' },
    contact: { email: 'juan.delacruz@email.com', mobile: '09123456789', landline: '' },
    zBenefits: { pdFirstPolicy: false, kidneyTransplant: false },
    previousAvailment: { kidneyTransplant: false },
    hdDetails: { type: 'Low flux' },
    pdDetails: { system: '' },
    admin: { pddRegNo: 'AUTO-GEN', registeredBy: 'Juan Dela Cruz (Patient)', accreditationNo: 'N/A', registrationDate: new Date().toISOString() },
  });

  const updateNested = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as object),
        [field]: value
      }
    }));
  };

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    const finalData: PDDRegistration = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      recordStatus: 'Pending' as RecordStatus,
    } as PDDRegistration;
    
    onSubmit(finalData);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-12 relative">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-slate-100 -z-10"></div>
      {[
        { n: 1, label: 'Identity', icon: User },
        { n: 2, label: 'Contact', icon: MapPin },
        { n: 3, label: 'Medical', icon: Stethoscope },
        { n: 4, label: 'Review', icon: ShieldCheck },
      ].map((s) => (
        <div key={s.n} className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 font-bold shadow-lg
            ${step === s.n ? 'bg-emerald-600 text-white border-emerald-400 scale-110' : 
              step > s.n ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-white text-slate-300 border-slate-100'}
          `}>
            {step > s.n ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${step === s.n ? 'text-emerald-700' : 'text-slate-400'}`}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 transition-all duration-500">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800">PhilHealth Dialysis Database</h2>
          <p className="text-slate-400 mt-1">Registration Form (digital version 1.0)</p>
        </header>

        <StepIndicator />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {/* Step 1: Identity Info */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Registration Type</label>
                    <div className="flex gap-2">
                      {['New Registration', 'Reactivation'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, regType: type as any })}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all
                            ${formData.regType === type ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
                          `}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">PIN Number</label>
                    <input 
                      type="text" 
                      placeholder="00-000000000-0"
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Patient Name</label>
                  <div className="grid grid-cols-4 gap-4">
                    <input 
                      placeholder="Last Name" 
                      className="col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.patientName?.last}
                      onChange={(e) => updateNested('patientName', 'last', e.target.value)}
                    />
                    <input 
                      placeholder="First Name" 
                      className="col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.patientName?.first}
                      onChange={(e) => updateNested('patientName', 'first', e.target.value)}
                    />
                    <input 
                      placeholder="Extension" 
                      className="col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.patientName?.extension}
                      onChange={(e) => updateNested('patientName', 'extension', e.target.value)}
                    />
                    <input 
                      placeholder="Middle Initial" 
                      className="col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.patientName?.middle}
                      onChange={(e) => updateNested('patientName', 'middle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Membership</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 appearance-none"
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value as any })}
                    >
                      <option value="Principal Member">Principal Member</option>
                      <option value="Dependent">Dependent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date of Birth</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sex</label>
                    <div className="flex gap-2">
                      {['Male', 'Female'].map((sex) => (
                        <button
                          key={sex}
                          onClick={() => setFormData({ ...formData, sex: sex as any })}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all
                            ${formData.sex === sex ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
                          `}
                        >
                          {sex}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Civil Status</label>
                    <input 
                      placeholder="e.g. Single, Married, Widowed" 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.civilStatus}
                      onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-800">Mailing Address</h4>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                    <div className="lg:col-span-1 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unit/Room No.</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="e.g. 301" value={formData.address?.unit} onChange={(e) => updateNested('address', 'unit', e.target.value)} />
                    </div>
                    <div className="lg:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Building/Street</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="Unit Name or Street Address" value={formData.address?.street} onChange={(e) => updateNested('address', 'street', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Barangay</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.barangay} onChange={(e) => updateNested('address', 'barangay', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City/Municipality</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.city} onChange={(e) => updateNested('address', 'city', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Province</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.province} onChange={(e) => updateNested('address', 'province', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-800">Contact Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="+63 9xx xxxx xxx" value={formData.contact?.mobile} onChange={(e) => updateNested('contact', 'mobile', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="patient@example.com" value={formData.contact?.email} onChange={(e) => updateNested('contact', 'email', e.target.value)} />
                    </div>
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Landline Number</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="(02) xxxx-xxxx" value={formData.contact?.landline} onChange={(e) => updateNested('contact', 'landline', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Info */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Z Benefits Checkboxes */}
                  <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-50 pb-2">Z Benefit Enrollment</h4>
                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.zBenefits?.pdFirstPolicy ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 group-hover:border-emerald-400'}`}>
                        {formData.zBenefits?.pdFirstPolicy && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.zBenefits?.pdFirstPolicy} onChange={(e) => updateNested('zBenefits', 'pdFirstPolicy', e.target.checked)} />
                      <span className="text-sm font-semibold text-slate-700">PD First Policy</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group border-t border-slate-50 pt-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.zBenefits?.kidneyTransplant ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200 group-hover:border-emerald-400'}`}>
                        {formData.zBenefits?.kidneyTransplant && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={formData.zBenefits?.kidneyTransplant} onChange={(e) => updateNested('zBenefits', 'kidneyTransplant', e.target.checked)} />
                      <span className="text-sm font-semibold text-slate-700">Kidney Transplantation</span>
                    </label>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-3xl space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dialysis Start Date</label>
                      <input 
                        type="month" 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.dialysisStartDate}
                        onChange={(e) => setFormData({ ...formData, dialysisStartDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">For HD: Type of Dialyzer</label>
                      <select 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 appearance-none font-semibold text-slate-700"
                        value={formData.hdDetails?.type}
                        onChange={(e) => updateNested('hdDetails', 'type', e.target.value)}
                      >
                        <option value="Low flux">Low Flux</option>
                        <option value="High flux">High Flux</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {formData.hdDetails?.type === 'Others' && (
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Other Dialyzer Type (please specify)</label>
                        <input
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500"
                          placeholder="Specify other dialyzer type..."
                          value={formData.hdDetails?.othersDetail ?? ''}
                          onChange={(e) => updateNested('hdDetails', 'othersDetail', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white border-2 border-emerald-100 rounded-3xl">
                   <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-6">Current PD System Selection</h4>
                   <div className="grid grid-cols-5 gap-3">
                     {['CAPD', 'CIPD-C', 'CIPD-M', 'CCPD', 'NIPD'].map((sys) => (
                       <button
                         key={sys}
                         onClick={() => updateNested('pdDetails', 'system', sys)}
                         className={`py-6 px-2 rounded-2xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center gap-2
                           ${formData.pdDetails?.system === sys ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg scale-105' : 'bg-white border-slate-50 text-slate-400 hover:border-emerald-200'}
                         `}
                       >
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.pdDetails?.system === sys ? 'bg-white/20' : 'bg-slate-50'}`}>
                           {formData.pdDetails?.system === sys ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <Activity className="w-4 h-4 opacity-30" />}
                         </div>
                         {sys}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Final Verification</h3>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">Please review the details below. Once submitted, this registration will be queued for PhilHealth verification.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Patient Profile</p>
                    <div className="space-y-2">
                       <p className="text-lg font-bold text-slate-800 uppercase">{formData.patientName?.last}, {formData.patientName?.first}</p>
                       <div className="flex gap-4 text-sm font-medium text-slate-500">
                         <span>{formData.sex}</span>
                         <span>•</span>
                         <span>{formData.pin}</span>
                       </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dialysis Config</p>
                    <div className="space-y-2">
                       <p className="text-lg font-bold text-slate-800">{formData.pdDetails?.system || formData.hdDetails?.type}</p>
                       <div className="flex gap-4 text-sm font-medium text-slate-500">
                         <span>Start: {formData.dialysisStartDate}</span>
                         <span>•</span>
                         <span>{formData.regType}</span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4">
                  <div className="shrink-0 pt-1">
                    <Info className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-sm text-emerald-800 leading-relaxed italic">
                    I certify that the information given are true and correct. I understand that this information will be used for dialysis claims reimbursement.
                  </div>
                </div>

                {/* Certification Fields */}
                <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl space-y-6">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3">
                    Certification &amp; Registration Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">16. Signature / Thumbmark (Upload Image)</label>
                      {(formData as any).signaturePreview ? (
                        <div className="relative w-full h-32 bg-slate-50 border-2 border-emerald-200 rounded-xl overflow-hidden group">
                          <img
                            src={(formData as any).signaturePreview}
                            alt="Signature / Thumbmark"
                            className="w-full h-full object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, signaturePreview: '', signatureFileName: '' } as any))}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          >
                            ×
                          </button>
                          <p className="absolute bottom-2 left-3 text-[10px] text-slate-400 truncate max-w-[80%]">{(formData as any).signatureFileName}</p>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group">
                          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-xs font-semibold">Click to upload signature or thumbmark</span>
                            <span className="text-[10px]">PNG, JPG, JPEG — max 2MB</span>
                          </div>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) {
                                alert('File size must be under 2MB.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setFormData(prev => ({
                                  ...prev,
                                  signaturePreview: ev.target?.result as string,
                                  signatureFileName: file.name,
                                } as any));
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">17. Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={(formData as any).signatureDate ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, signatureDate: e.target.value } as any))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">18. PDD Registration No.</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        placeholder="Auto-generated upon approval"
                        value={formData.admin?.pddRegNo === 'AUTO-GEN' ? '' : formData.admin?.pddRegNo ?? ''}
                        onChange={(e) => updateNested('admin', 'pddRegNo', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">19. Registered By (Health Care Institution)</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        placeholder="Name of Health Care Institution"
                        value={formData.admin?.registeredBy?.startsWith('Juan Dela Cruz') ? '' : formData.admin?.registeredBy ?? ''}
                        onChange={(e) => updateNested('admin', 'registeredBy', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">20. Accreditation No.</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        placeholder="e.g. HCI-2024-00001"
                        value={formData.admin?.accreditationNo === 'N/A' ? '' : formData.admin?.accreditationNo ?? ''}
                        onChange={(e) => updateNested('admin', 'accreditationNo', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">21. Registration Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.admin?.registrationDate ? formData.admin.registrationDate.substring(0, 10) : ''}
                        onChange={(e) => updateNested('admin', 'registrationDate', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all
              ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {step < totalSteps ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all outline-none"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-10 py-4 bg-emerald-900 text-yellow-400 rounded-2xl font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition-all outline-none"
            >
              Submit Registration
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
