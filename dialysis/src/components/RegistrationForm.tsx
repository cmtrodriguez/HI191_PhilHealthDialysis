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

function makeCursiveSignatureDataUrl(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) return '';

  const canvas = document.createElement('canvas');
  canvas.width = 900;
  canvas.height = 240;

  const context = canvas.getContext('2d');

  if (!context) return '';

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#000000';
  context.textAlign = 'left';
context.textBaseline = 'middle';

let fontSize = 96;

do {
  context.font = `${fontSize}px "Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive`;
  fontSize -= 4;
} while (
  context.measureText(trimmedName).width > canvas.width - 80 &&
  fontSize > 48
);

context.fillText(trimmedName, 30, canvas.height / 2 + 10);

return canvas.toDataURL('image/png');
}

export default function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const totalSteps = 4;

  const [formData, setFormData] = useState<Partial<PDDRegistration>>({
  regType: 'New Registration',
  pin: '',
  memberType: 'Principal Member',
  dob: '',
  sex: 'Male',
  civilStatus: '',
  patientName: { first: '', last: '', middle: '', extension: '' },
  address: { unit: '', building: '', lot: '', street: '', subdivision: '', barangay: '', city: '', province: '', country: 'Philippines', zip: '' },
  contact: { email: '', mobile: '', landline: '' },
  zBenefits: { pdFirstPolicy: false, kidneyTransplant: false },
  previousAvailment: { kidneyTransplant: false },
  dialysisStartDate: '',
  hdDetails: { type: 'Low flux' },
  pdDetails: { system: '' },
  admin: { pddRegNo: 'AUTO-GEN', registeredBy: '', accreditationNo: '', registrationDate: '' },
  });
  const [stepError, setStepError] = useState<string[]>([]);

  const updateNested = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as object),
        [field]: value
      }
    }));
  };

  const validateStep = (stepNumber: number) => {
    const errors: string[] = [];

    if (stepNumber === 1) {
      if (!formData.pin?.trim()) errors.push('PIN is required.');
      if (!formData.patientName?.last?.trim()) errors.push('Patient last name is required.');
      if (!formData.patientName?.first?.trim()) errors.push('Patient first name is required.');
      if (!formData.memberType?.trim()) errors.push('Current membership type is required.');
      if (!formData.dob) errors.push('Date of birth is required.');
      if (!formData.sex?.trim()) errors.push('Sex selection is required.');
      if (!formData.civilStatus?.trim()) errors.push('Civil status is required.');
    }

    if (stepNumber === 2) {
      if (!formData.address?.street?.trim()) errors.push('Building or street address is required.');
      if (!formData.address?.barangay?.trim()) errors.push('Barangay is required.');
      if (!formData.address?.city?.trim()) errors.push('City or municipality is required.');
      if (!formData.address?.province?.trim()) errors.push('Province is required.');
      if (!formData.contact?.mobile?.trim()) errors.push('Mobile number is required.');
      if (!formData.contact?.email?.trim()) errors.push('Email address is required.');
    }

    if (stepNumber === 3) {
      if (!formData.dialysisStartDate) errors.push('Dialysis start date is required.');
      if (!formData.hdDetails?.type?.trim()) errors.push('HD dialyzer type is required.');
      if (formData.hdDetails?.type === 'Others' && !formData.hdDetails?.othersDetail?.trim()) errors.push('Please specify the other dialyzer type.');
    }

    if (stepNumber === 4) {
      // Identity / Registration fields (also shown in review)
      if (!formData.pin?.trim()) errors.push('PIN is required.');
      if (!formData.patientName?.last?.trim()) errors.push('Patient last name is required.');
      if (!formData.patientName?.first?.trim()) errors.push('Patient first name is required.');
      if (!formData.sex?.trim()) errors.push('Sex selection is required.');
      if (!formData.dob) errors.push('Date of birth is required.');
      if (!formData.regType?.trim()) errors.push('Registration type is required.');

      // Dialysis configuration shown in review
      if (!formData.dialysisStartDate) errors.push('Dialysis start date is required.');
      const hasDialysisType = (formData.pdDetails?.system && formData.pdDetails.system.trim()) || (formData.hdDetails?.type && formData.hdDetails.type.trim());
      if (!hasDialysisType) errors.push('Dialysis system/type selection is required.');

      // Certification & admin fields
      if (!(formData as any).signatureName?.trim()) errors.push('Signature name is required for submission.');
      if (!(formData as any).signatureDate) errors.push('Signature date is required for submission.');
      // PDD Registration No. is intentionally NOT required (auto-generated on approval)
      if (!formData.admin?.registeredBy?.trim()) errors.push('Registered By (Health Care Institution) is required.');
      if (!formData.admin?.accreditationNo?.trim()) errors.push('Accreditation No. is required.');
      if (!formData.admin?.registrationDate) errors.push('Registration Date is required.');
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      setStepError(errors);
      return;
    }

    setStepError([]);
    setStep(s => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setStepError([]);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleCommitClick = () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      setStepError(errors);
      setShowConfirm(true);
      return;
    }

    setStepError([]);
    setShowConfirm(true);
  };

  const handleSubmit = () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      setShowConfirm(false);
      setStepError(errors);
      return;
    }

    setShowConfirm(false);

    const finalData: PDDRegistration = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      recordStatus: 'Pending' as RecordStatus,
    } as PDDRegistration;
    
    onSubmit(finalData);
  };

  const cardPanelClass = 'p-6 bg-slate-50/60 border border-slate-100 rounded-3xl space-y-6';
  const cardHeaderClass = 'flex items-center gap-3 border-b border-slate-200/50 pb-3';
  const cardTitleClass = 'text-xs font-bold text-slate-500 uppercase tracking-wider';
  const fieldLabelClass = 'text-[11px] font-bold text-slate-400 uppercase tracking-widest block ml-0.5 mb-1.5';
  const inputControlClass = 'w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-slate-700 font-medium transition-all placeholder:text-slate-300';
  const selectControlClass = 'w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-slate-700 font-medium transition-all appearance-none cursor-pointer';
  const segmentedWrapperClass = 'flex gap-1.5 h-12 bg-white p-1 border border-slate-200 rounded-xl';
  const segmentedButtonClass = (active: boolean) => `flex-1 rounded-lg text-xs font-bold transition-all ${active ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 bg-transparent'}`;
  const requiredMark = <span className="text-red-500">*</span>;

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
            {stepError.length > 0 && (
              <div className="mb-6 rounded-3xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <p className="font-semibold">Please fix the following required field(s):</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-xs text-rose-700/90">
                  {stepError.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">PIN Number {requiredMark}</label>
                    <input 
                      type="text" 
                      placeholder="00-000000000-0"
                      value={formData.pin ?? ''}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 outline-none transition-all font-mono tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Patient Name</label>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name {requiredMark}</label>
                      <input 
                        placeholder="Last Name" 
                        className="w-full col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.patientName?.last ?? ''}
                        onChange={(e) => updateNested('patientName', 'last', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name {requiredMark}</label>
                      <input 
                        placeholder="First Name" 
                        className="w-full col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.patientName?.first ?? ''}
                        onChange={(e) => updateNested('patientName', 'first', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Extension</label>
                      <input 
                        placeholder="Extension" 
                        className="w-full col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.patientName?.extension ?? ''}
                        onChange={(e) => updateNested('patientName', 'extension', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Middle Initial</label>
                      <input 
                        placeholder="Middle Initial" 
                        className="w-full col-span-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.patientName?.middle ?? ''}
                        onChange={(e) => updateNested('patientName', 'middle', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Membership {requiredMark}</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 appearance-none"
                      value={formData.memberType}
                      onChange={(e) => setFormData({ ...formData, memberType: e.target.value as any })}
                      required
                    >
                      <option value="Principal Member">Principal Member</option>
                      <option value="Dependent">Dependent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Date of Birth {requiredMark}</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.dob ?? ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sex {requiredMark}</label>
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
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Civil Status {requiredMark}</label>
                    <input 
                      placeholder="e.g. Single, Married, Widowed" 
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                      value={formData.civilStatus ?? ''}
                      onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
                      required
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
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="e.g. 301" value={formData.address?.unit ?? ''} onChange={(e) => updateNested('address', 'unit', e.target.value)} />
                    </div>
                    <div className="lg:col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Building/Street {requiredMark}</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="Unit Name or Street Address" value={formData.address?.street ?? ''} onChange={(e) => updateNested('address', 'street', e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Barangay {requiredMark}</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.barangay ?? ''} onChange={(e) => updateNested('address', 'barangay', e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City/Municipality {requiredMark}</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.city ?? ''} onChange={(e) => updateNested('address', 'city', e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Province {requiredMark}</label>
                      <input className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" value={formData.address?.province ?? ''} onChange={(e) => updateNested('address', 'province', e.target.value)} required />
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Number {requiredMark}</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="+63 9xx xxxx xxx" value={formData.contact?.mobile ?? ''} onChange={(e) => updateNested('contact', 'mobile', e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address {requiredMark}</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="patient@example.com" value={formData.contact?.email ?? ''} onChange={(e) => updateNested('contact', 'email', e.target.value)} required />
                    </div>
                    <div className="space-y-1 col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Landline Number</label>
                      <input className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-500" placeholder="(02) xxxx-xxxx" value={formData.contact?.landline ?? ''} onChange={(e) => updateNested('contact', 'landline', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Z Benefits Checkboxes */}
                  <div className={`${cardPanelClass} md:col-span-6`}>
                    <div className={cardHeaderClass}>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h4 className={cardTitleClass}>Z Benefit Enrollment</h4>
                    </div>
                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50/20 cursor-pointer transition-colors group">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.zBenefits?.pdFirstPolicy ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'}`}>
                          {formData.zBenefits?.pdFirstPolicy && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.zBenefits?.pdFirstPolicy} onChange={(e) => updateNested('zBenefits', 'pdFirstPolicy', e.target.checked)} />
                        <span className="text-xs font-bold text-slate-600">PD First Policy</span>
                      </label>
                      
                      <label className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50/20 cursor-pointer transition-colors group">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.zBenefits?.kidneyTransplant ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'}`}>
                          {formData.zBenefits?.kidneyTransplant && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.zBenefits?.kidneyTransplant} onChange={(e) => updateNested('zBenefits', 'kidneyTransplant', e.target.checked)} />
                        <span className="text-xs font-bold text-slate-600">Kidney Transplantation</span>
                      </label>
                    </div>
                  </div>

                  {/* Previous Availment Segment */}
                  <div className={`${cardPanelClass} md:col-span-6`}>
                    <div className={cardHeaderClass}>
                      <Activity className="w-4 h-4 text-emerald-600" />
                      <h4 className={cardTitleClass}>Previous Availment (Case Rates)</h4>
                    </div>
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-slate-500 mb-2 ml-0.5">• Kidney Transplantation</p>
                      <div className={segmentedWrapperClass}>
                        <button
                          type="button"
                          onClick={() => updateNested('previousAvailment', 'kidneyTransplant', true)}
                          className={segmentedButtonClass(formData.previousAvailment?.kidneyTransplant === true)}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateNested('previousAvailment', 'kidneyTransplant', false)}
                          className={segmentedButtonClass(formData.previousAvailment?.kidneyTransplant === false)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dialysis Configurations */}
                <div className={cardPanelClass}>
                  <div className={cardHeaderClass}>
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    <h4 className={cardTitleClass}>Dialysis Configurations</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className={fieldLabelClass}>I started dialysis on (month & year) {requiredMark}</label>
                      <input 
                        type="month" 
                        className={inputControlClass}
                        value={formData.dialysisStartDate ?? ''}
                        onChange={(e) => setFormData({ ...formData, dialysisStartDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="md:col-span-6 relative">
                      <label className={fieldLabelClass}>For HD: Type of Dialyzer {requiredMark}</label>
                      <select 
                        className={selectControlClass}
                        value={formData.hdDetails?.type}
                        onChange={(e) => updateNested('hdDetails', 'type', e.target.value)}
                        required
                      >
                        <option value="Low flux">Low Flux</option>
                        <option value="High flux">High Flux</option>
                        <option value="Others">Others</option>
                      </select>
                      <div className="pointer-events-none absolute bottom-4 right-4 text-slate-400 text-[10px]">▼</div>
                    </div>
                  </div>

                  {formData.hdDetails?.type === 'Others' && (
                    <div className="pt-1">
                      <label className={fieldLabelClass}>Other Dialyzer Type (Please Specify)</label>
                      <input
                        className={inputControlClass}
                        placeholder="Specify custom technical model description..."
                        value={formData.hdDetails?.othersDetail ?? ''}
                        onChange={(e) => updateNested('hdDetails', 'othersDetail', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Peritoneal Dialysis System */}
                <div className={cardPanelClass}>
                  <div className={cardHeaderClass}>
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h4 className={cardTitleClass}>15. For PD: Current PD System Selection</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['CAPD', 'CIPD-C', 'CIPD-M', 'CCPD', 'NIPD'].map((sys) => {
                      const isSelected = formData.pdDetails?.system === sys;
                      return (
                        <button
                          key={sys}
                          type="button"
                          onClick={() => updateNested('pdDetails', 'system', sys)}
                          className={`h-14 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 md:col-span-2
                            ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100 scale-[1.02]' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-slate-600'}
                          `}
                        >
                          <Activity className={`w-4 h-4 ${isSelected ? 'text-white opacity-100' : 'text-slate-300'}`} />
                          {sys}
                        </button>
                      );
                    })}
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                        16. Signature / Thumbmark {requiredMark}
                      </label>

                      <input
                        type="text"
                        placeholder="Type your full name as signature"
                        value={(formData as any).signatureName ?? ''}
                        onChange={(e) => {
                          const typedName = e.target.value;

                          setFormData(prev => ({
                            ...prev,
                            signatureName: typedName,
                            signaturePreview: makeCursiveSignatureDataUrl(typedName),
                            signatureFileName: 'typed-cursive-signature.png',
                          } as any));
                        }}
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500 text-2xl"
                        style={{
                          fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
                        }}
                        required
                      />

                      {(formData as any).signaturePreview && (
                        <div className="w-full h-24 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                          <img
                            src={(formData as any).signaturePreview}
                            alt="Typed cursive signature preview"
                            className="max-h-20 object-contain"
                          />
                        </div>
                      )}

                      <p className="text-[10px] text-slate-400 font-semibold">
                        The typed name will be converted into a cursive signature image when exported to PDF.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">17. Date {requiredMark}</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={(formData as any).signatureDate ?? ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, signatureDate: e.target.value } as any))}
                        required
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">19. Registered By (Health Care Institution) {requiredMark}</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        placeholder="Name of Health Care Institution"
                        value={formData.admin?.registeredBy?.startsWith('Juan Dela Cruz') ? '' : formData.admin?.registeredBy ?? ''}
                        onChange={(e) => updateNested('admin', 'registeredBy', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">20. Accreditation No. {requiredMark}</label>
                      <input
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        placeholder="e.g. HCI-2024-00001"
                        value={formData.admin?.accreditationNo === 'N/A' ? '' : formData.admin?.accreditationNo ?? ''}
                        onChange={(e) => updateNested('admin', 'accreditationNo', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">21. Registration Date {requiredMark}</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-emerald-500"
                        value={formData.admin?.registrationDate ? formData.admin.registrationDate.substring(0, 10) : ''}
                        onChange={(e) => updateNested('admin', 'registrationDate', e.target.value)}
                        required
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
            type="button"
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
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all outline-none"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCommitClick}
              className="flex items-center gap-2 px-10 py-4 bg-emerald-900 text-yellow-400 rounded-2xl font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition-all outline-none"
            >
              Complete Submission
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', duration: 0.4 }}
                className="relative z-10 w-full max-w-sm space-y-4 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
                  <Info className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold tracking-tight text-slate-800">
                    {stepError.length > 0 ? 'Required Fields Missing' : 'Confirm Submission'}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    {stepError.length > 0
                      ? 'Please resolve the following required fields before submitting.'
                      : 'Are you sure you want to submit this registration form? Please review the details before completing the application.'}
                  </p>
                </div>

                {stepError.length > 0 && (
                  <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-left text-xs text-rose-700">
                    <ul className="list-disc list-inside space-y-1">
                      {stepError.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="h-11 flex-1 rounded-xl border border-slate-200/60 bg-slate-50 text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={stepError.length > 0}
                    className={`h-11 flex-1 rounded-xl text-xs font-bold transition-colors ${stepError.length > 0 ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 text-white shadow-md shadow-emerald-100 hover:bg-emerald-700'}`}
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
