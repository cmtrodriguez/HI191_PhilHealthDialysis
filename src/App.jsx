import React, { useState } from 'react';
import './App.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const initialData = {
  registrationType: '',
  pin: '',
  lastName: '', firstName: '', nameExtension: '', middleName: '',
  membershipType: '',
  dob: '', sex: '', civilStatus: '',
  unitRoom: '', buildingName: '', lotBlock: '', street: '', subdivision: '',
  barangay: '', city: '', province: '', country: '', zipCode: '',
  email: '', mobile: '', landline: '',
  pdFirstPolicy: '', kidneyTransplantation: '',
  previousAvailment: '',
  dialysisStartMonth: '', dialysisStartYear: '',
  hdDialyzerType: '', hdDialyzerOthers: '',
  pdSystem: '',
  signatureName: '', signatureDate: '',
  pddRegistrationNumber: '', registeredBy: '',
  accreditationNumber: '', registrationDate: '',
};

function Field({ label, number, children, hint }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label">
          {number && <span className="field-num">{number}.</span>} {label}
        </label>
      )}
      {children}
      {hint && <small>{hint}</small>}
    </div>
  );
}

function RadioGroup({ name, options, value, onChange, inline = false }) {
  return (
    <div className={`radio-group${inline ? ' radio-group--inline' : ''}`}>
      {options.map(opt => (
        <label key={opt.value} className="radio-label">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={e => onChange(e.target.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  const validate = () => {
    const e = {};
    if (!data.registrationType) e.registrationType = true;
    if (!data.pin.trim()) e.pin = true;
    if (!data.lastName.trim()) e.lastName = true;
    if (!data.firstName.trim()) e.firstName = true;
    if (!data.membershipType) e.membershipType = true;
    if (!data.dob) e.dob = true;
    if (!data.sex) e.sex = true;
    if (!data.signatureName.trim()) e.signatureName = true;
    if (!data.signatureDate) e.signatureDate = true;
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const first = document.querySelector('.field-input--error, .radio-group--error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="page-wrap">
        <div className="page">
          <div className="success-box">
            <div className="success-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2>Registration Submitted</h2>
            <p>Thank you, <strong>{data.firstName} {data.lastName}</strong>. Your PhilHealth Dialysis Database registration has been submitted successfully.</p>
            <div className="success-details">
              <div className="success-row"><span>Registration Type</span><strong>{data.registrationType === 'new' ? 'New Registration' : 'Reactivation'}</strong></div>
              <div className="success-row"><span>PIN</span><strong>{data.pin}</strong></div>
              <div className="success-row"><span>Date</span><strong>{new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
            </div>
            <p className="success-note">Please keep a copy of this submission. The health care institution will provide your PDD Registration Number upon processing.</p>
            <button className="btn-submit" onClick={() => { setSubmitted(false); setData(initialData); }}>Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="page">
        {/* Header */}
        <div className="form-header">
          <div className="form-header-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-label="PhilHealth" role="img">
              <circle cx="24" cy="24" r="24" fill="#006b5c"/>
              <path d="M12 24a12 12 0 0 1 24 0" stroke="#ffd700" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="24" cy="24" r="6" fill="white"/>
              <path d="M24 12v3M24 33v3M12 24H9M39 24h-3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div>
              <div className="form-header-brand">PhilHealth</div>
              <div className="form-header-tagline">Your Partner in Health</div>
            </div>
          </div>
          <div className="form-header-meta">
            <span>This form may be reproduced and is NOT FOR SALE</span>
          </div>
        </div>

        <h1>PhilHealth Dialysis Database</h1>
        <p className="intro">
          <strong>Registration Form</strong><br />
          I would like to register under the PhilHealth Dialysis Database. I understand that the following information will be used by PhilHealth for my claims reimbursement. Also, I am giving my consent to access my pertinent clinical information.
        </p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Section 1: Identification */}
          <div className="section-card">
            <div className="col-2">
              {/* Registration Type */}
              <Field label="REGISTRATION TYPE">
                <div className={`radio-group radio-group--inline${errors.registrationType ? ' radio-group--error' : ''}`}>
                  {[{value:'new',label:'New Registration'},{value:'reactivation',label:'Reactivation'}].map(opt => (
                    <label key={opt.value} className="radio-label">
                      <input type="radio" name="registrationType" value={opt.value} checked={data.registrationType === opt.value} onChange={e => set('registrationType', e.target.value)} />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.registrationType && <span className="err">Please select a registration type.</span>}
              </Field>

              {/* PIN */}
              <Field label="PHILHEALTH IDENTIFICATION NUMBER (PIN)" number="1">
                <input
                  type="text" inputMode="numeric"
                  className={`field-input${errors.pin ? ' field-input--error' : ''}`}
                  value={data.pin} onChange={e => set('pin', e.target.value.replace(/\D/g,'').substring(0,12))}
                  placeholder="Ex: 123456789012"
                />
                {errors.pin && <span className="err">PIN is required.</span>}
              </Field>
            </div>

            {/* Name */}
            <div className="section-label">2. NAME OF CKD PATIENT</div>
            <div className="col-4">
              <Field label="Last Name">
                <input type="text" className={`field-input${errors.lastName ? ' field-input--error' : ''}`} value={data.lastName} onChange={e => set('lastName', e.target.value.toUpperCase())} placeholder="Ex: DELA CRUZ" />
                {errors.lastName && <span className="err">Required.</span>}
              </Field>
              <Field label="First Name">
                <input type="text" className={`field-input${errors.firstName ? ' field-input--error' : ''}`} value={data.firstName} onChange={e => set('firstName', e.target.value.toUpperCase())} placeholder="Ex: JUAN" />
                {errors.firstName && <span className="err">Required.</span>}
              </Field>
              <Field label="Name Extension (JR/SR/III)">
                <input type="text" className="field-input" value={data.nameExtension} onChange={e => set('nameExtension', e.target.value.toUpperCase())} placeholder="Ex: JR" />
              </Field>
              <Field label="Middle Name">
                <input type="text" className="field-input" value={data.middleName} onChange={e => set('middleName', e.target.value.toUpperCase())} placeholder="Ex: SIPAG" />
              </Field>
            </div>

            {/* Member type, DOB, Sex */}
            <div className="col-3">
              <Field label="CURRENTLY, I AM A" number="3">
                <div className={`radio-group radio-group--inline${errors.membershipType ? ' radio-group--error' : ''}`}>
                  {[{value:'principal',label:'Principal Member'},{value:'dependent',label:'Dependent'}].map(opt => (
                    <label key={opt.value} className="radio-label">
                      <input type="radio" name="membershipType" value={opt.value} checked={data.membershipType === opt.value} onChange={e => set('membershipType', e.target.value)} />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.membershipType && <span className="err">Required.</span>}
              </Field>
              <Field label="DATE OF BIRTH" number="4">
                <input type="date" className={`field-input${errors.dob ? ' field-input--error' : ''}`} value={data.dob} onChange={e => set('dob', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                {errors.dob && <span className="err">Required.</span>}
              </Field>
              <Field label="SEX" number="5">
                <div className={`radio-group radio-group--inline${errors.sex ? ' radio-group--error' : ''}`}>
                  {[{value:'male',label:'Male'},{value:'female',label:'Female'}].map(opt => (
                    <label key={opt.value} className="radio-label">
                      <input type="radio" name="sex" value={opt.value} checked={data.sex === opt.value} onChange={e => set('sex', e.target.value)} />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.sex && <span className="err">Required.</span>}
              </Field>
            </div>

            {/* Civil Status */}
            <Field label="CIVIL STATUS" number="6">
              <input type="text" className="field-input" value={data.civilStatus} onChange={e => set('civilStatus', e.target.value)} placeholder="Ex: Single" style={{ maxWidth: '320px' }} />
            </Field>

            {/* Mailing Address */}
            <div className="section-label">7. MAILING ADDRESS</div>
            <div className="col-5">
              <Field label="Unit / Room No. / Floor"><input type="text" className="field-input" value={data.unitRoom} onChange={e => set('unitRoom', e.target.value)} placeholder="Ex: 12A" /></Field>
              <Field label="Building Name"><input type="text" className="field-input" value={data.buildingName} onChange={e => set('buildingName', e.target.value)} placeholder="Ex: Green Tower" /></Field>
              <Field label="Lot / Block / House / Bldg. No."><input type="text" className="field-input" value={data.lotBlock} onChange={e => set('lotBlock', e.target.value)} placeholder="Ex: Lot 5, Block 3" /></Field>
              <Field label="Street"><input type="text" className="field-input" value={data.street} onChange={e => set('street', e.target.value)} placeholder="Ex: Main St." /></Field>
              <Field label="Subdivision / Village"><input type="text" className="field-input" value={data.subdivision} onChange={e => set('subdivision', e.target.value)} placeholder="Ex: Sunshine Village" /></Field>
            </div>
            <div className="col-5">
              <Field label="Barangay"><input type="text" className="field-input" value={data.barangay} onChange={e => set('barangay', e.target.value)} placeholder="Ex: San Isidro" /></Field>
              <Field label="City / Municipality"><input type="text" className="field-input" value={data.city} onChange={e => set('city', e.target.value)} placeholder="Ex: Quezon City" /></Field>
              <Field label="Province"><input type="text" className="field-input" value={data.province} onChange={e => set('province', e.target.value)} placeholder="Ex: Metro Manila" /></Field>
              <Field label="Country"><input type="text" className="field-input" value={data.country} onChange={e => set('country', e.target.value)} placeholder="Ex: Philippines" /></Field>
              <Field label="Zip Code"><input type="text" inputMode="numeric" className="field-input" value={data.zipCode} onChange={e => set('zipCode', e.target.value.replace(/\D/g,'').substring(0,4))} placeholder="Ex: 1101" /></Field>
            </div>

            {/* Contact */}
            <div className="col-3">
              <Field label="EMAIL ADDRESS" number="8"><input type="email" className="field-input" value={data.email} onChange={e => set('email', e.target.value)} placeholder="name@example.com" /></Field>
              <Field label="MOBILE NUMBER" number="9"><input type="tel" className="field-input" value={data.mobile} onChange={e => set('mobile', e.target.value)} placeholder="09XX-XXX-XXXX" /></Field>
              <Field label="LANDLINE" number="10"><input type="tel" className="field-input" value={data.landline} onChange={e => set('landline', e.target.value)} placeholder="(02) XXXX-XXXX" /></Field>
            </div>
          </div>

          {/* Section 2: Benefits */}
          <div className="section-card">
            <div className="section-label">11. IS THE PATIENT ENROLLED UNDER THE Z BENEFITS?</div>
            <div className="col-2" style={{ marginTop: '12px' }}>
              <Field label="PD First Policy">
                <div className="radio-group radio-group--inline">
                  {[{value:'yes',label:'Yes'},{value:'no',label:'No'}].map(opt => (
                    <label key={opt.value} className="radio-label"><input type="radio" name="pdFirstPolicy" value={opt.value} checked={data.pdFirstPolicy === opt.value} onChange={e => set('pdFirstPolicy', e.target.value)} />{opt.label}</label>
                  ))}
                </div>
              </Field>
              <Field label="Kidney Transplantation">
                <div className="radio-group radio-group--inline">
                  {[{value:'yes',label:'Yes'},{value:'no',label:'No'}].map(opt => (
                    <label key={opt.value} className="radio-label"><input type="radio" name="kidneyTransplantation" value={opt.value} checked={data.kidneyTransplantation === opt.value} onChange={e => set('kidneyTransplantation', e.target.value)} />{opt.label}</label>
                  ))}
                </div>
              </Field>
            </div>

            <div className="section-label" style={{ marginTop: '20px' }}>12. PREVIOUS AVAILMENT UNDER ALL CASE RATES?</div>
            <Field label="Kidney Transplantation">
              <div className="radio-group radio-group--inline">
                {[{value:'yes',label:'Yes'},{value:'no',label:'No'}].map(opt => (
                  <label key={opt.value} className="radio-label"><input type="radio" name="previousAvailment" value={opt.value} checked={data.previousAvailment === opt.value} onChange={e => set('previousAvailment', e.target.value)} />{opt.label}</label>
                ))}
              </div>
            </Field>

            <div className="col-2" style={{ marginTop: '20px' }}>
              <Field label="I STARTED DIALYSIS ON (MONTH & YEAR)" number="13">
                <div className="col-2" style={{ gap: '12px' }}>
                  <select className="field-input" value={data.dialysisStartMonth} onChange={e => set('dialysisStartMonth', e.target.value)}>
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                  </select>
                  <select className="field-input" value={data.dialysisStartYear} onChange={e => set('dialysisStartYear', e.target.value)}>
                    <option value="">Year</option>
                    {Array.from({length:40},(_,i)=>new Date().getFullYear()-i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </Field>
              <Field label="FOR HD: TYPE OF DIALYZER" number="14">
                <div className="radio-group radio-group--inline">
                  {[{value:'lowFlux',label:'Low flux'},{value:'highFlux',label:'High flux'}].map(opt => (
                    <label key={opt.value} className="radio-label"><input type="radio" name="hdDialyzerType" value={opt.value} checked={data.hdDialyzerType === opt.value} onChange={e => set('hdDialyzerType', e.target.value)} />{opt.label}</label>
                  ))}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <input type="text" className="field-input" value={data.hdDialyzerOthers} onChange={e => set('hdDialyzerOthers', e.target.value)} placeholder="Others (please specify)" />
                </div>
              </Field>
            </div>

            <Field label="FOR PD: CURRENT PD SYSTEM" number="15">
              <div className="radio-group radio-group--inline" style={{ flexWrap: 'wrap' }}>
                {['CAPD','CIPD-C','CIPD-M','CCPD','NIPD'].map(sys => (
                  <label key={sys} className="radio-label"><input type="radio" name="pdSystem" value={sys} checked={data.pdSystem === sys} onChange={e => set('pdSystem', e.target.value)} />{sys}</label>
                ))}
              </div>
            </Field>
          </div>

          {/* Section 3: Certification */}
          <div className="section-card">
            <p className="cert-text">I CERTIFY THAT THE HEREIN INFORMATION GIVEN ARE TRUE AND CORRECT.</p>
            <div className="col-2">
              <Field label="SIGNATURE / THUMBMARK" number="16">
                <input type="text" className={`field-input${errors.signatureName ? ' field-input--error' : ''}`} value={data.signatureName} onChange={e => set('signatureName', e.target.value)} placeholder="Printed Name" />
                {errors.signatureName && <span className="err">Signature is required.</span>}
              </Field>
              <Field label="DATE" number="17">
                <input type="date" className={`field-input${errors.signatureDate ? ' field-input--error' : ''}`} value={data.signatureDate} onChange={e => set('signatureDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                {errors.signatureDate && <span className="err">Date is required.</span>}
              </Field>
            </div>
            <div className="col-2">
              <Field label="PDD REGISTRATION NO." number="18">
                <input type="text" className="field-input" value={data.pddRegistrationNumber} onChange={e => set('pddRegistrationNumber', e.target.value)} />
              </Field>
              <Field label="REGISTERED BY (NAME OF HEALTH CARE INSTITUTION)" number="19">
                <input type="text" className="field-input" value={data.registeredBy} onChange={e => set('registeredBy', e.target.value)} />
              </Field>
            </div>
            <div className="col-2">
              <Field label="ACCREDITATION NO." number="20">
                <input type="text" className="field-input" value={data.accreditationNumber} onChange={e => set('accreditationNumber', e.target.value)} />
              </Field>
              <Field label="REGISTRATION DATE" number="21">
                <input type="date" className="field-input" value={data.registrationDate} onChange={e => set('registrationDate', e.target.value)} />
              </Field>
            </div>

            <button type="submit" className="btn-submit">Submit Registration</button>
          </div>

        </form>
      </div>
    </div>
  );
}
