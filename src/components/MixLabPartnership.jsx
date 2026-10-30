import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  font, h2, h3, body, bodyLg, buttonPrimary, buttonGhost, container, section, space,
} from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// The Mix Lab — Community Partnership: info section + 3-step application.
// Applications are sent to /api/partner-apply (saved in Supabase, emails sent).
// ──────────────────────────────────────────────────────────────────────────

const CONFIG = {
  contactEmail: 'connect@indabooth.com',
  // There is no privacy policy page on the site yet. When one exists, put its
  // path here (for example '/privacy') and the form will link to it.
  privacyUrl: null,
};

// Same Art Basel palette as MixLab.jsx
const P = {
  cobalt: '#2B3FD6',
  yellow: '#F9D000',
  ink: '#1B1B3A',
  inkSoft: '#3D3D5C',
  white: '#FFFFFF',
  pink: '#FFD3E6',
  peach: '#FFD9C7',
  butter: '#FFF1B8',
  mint: '#CDEFE0',
  lilac: '#E4D9FF',
  sky: '#D6E6FF',
  error: '#B3001B',
};

const poster = { border: `2px solid ${P.ink}`, boxShadow: `5px 5px 0 ${P.ink}` };

const pill = {
  display: 'inline-block',
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.04em',
  color: P.ink,
  background: P.yellow,
  border: `2px solid ${P.ink}`,
  borderRadius: '999px',
  padding: '6px 14px',
};

const CATEGORIES = [
  { key: 'health_wellness', label: 'Health & Wellness', bg: P.mint },
  { key: 'ai_tech_creative', label: 'AI, Technology & Creative Futures', bg: P.lilac },
  { key: 'business_financial', label: 'Business Development & Financial Growth', bg: P.butter },
  { key: 'community_social', label: 'Community & Social Capital', bg: P.pink },
];

const PACKAGES = [
  {
    key: 'standard',
    name: 'Standard',
    price: 500,
    bg: P.sky,
    benefits: [
      'Business logo',
      'Short business description',
      'Direct website or social media link',
      'Optional attendee offer or resource',
      'Standard placement within the selected category',
      'Inclusion in the Community Partner directory',
    ],
  },
  {
    key: 'featured',
    name: 'Featured',
    price: 1000,
    bg: P.butter,
    benefits: [
      'Larger business logo',
      'Expanded business description',
      'Direct website or social media link',
      'Optional attendee offer or resource',
      'Top placement within the selected category',
      'Inclusion in the Community Partner directory',
      'Logo included in the collective on-site partner display',
    ],
  },
];

const FLOW = ['Apply', 'Review', 'Approval', 'Payment', 'Submit listing materials', 'Listing review', 'Publication'];

const STEP_TITLES = ['Your business', 'Your partnership', 'Review & submit'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$|^@?[\w.]{2,40}$/;

const EMPTY = {
  business_name: '', contact_name: '', email: '', website: '', location: '', description: '',
  phone: '', instagram: '',
  category: '', package: '', connection: '', flexible: '', offer_choice: '', offer_description: '', notes: '',
  ack_application: false, ack_no_reservation: false, ack_benefits: false,
  marketing_opt_in: false,
  hp: '',
};

const STEP_FIELDS = {
  0: ['business_name', 'contact_name', 'email', 'website', 'location', 'description'],
  1: ['category', 'package', 'connection'],
  2: ['acks'],
};

const labelStyle = { display: 'block', fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.03em', color: P.ink, marginBottom: '6px' };
const errorText = { color: P.error, fontSize: '13px', marginTop: '6px' };
const hint = { color: P.inkSoft, fontSize: '13px', marginTop: '6px' };

// Defined outside the main component on purpose: if it lived inside, every keystroke
// would remount the field and the cursor would jump out of the input.
function Field({ name, label, required, hintText, error, children }) {
  return (
    <div style={{ marginBottom: space.md }}>
      <label htmlFor={`mlp-${name}`} style={labelStyle}>
        {label} {required ? <span aria-hidden="true">*</span> : <span style={{ color: P.inkSoft }}>(optional)</span>}
      </label>
      {children}
      {hintText && <div style={hint}>{hintText}</div>}
      {error && <div id={`mlp-${name}-error`} role="alert" style={errorText}>{error}</div>}
    </div>
  );
}

const REQUIRED = ['business_name', 'contact_name', 'email', 'website', 'location', 'description', 'connection'];

const money = (n) => `$${n.toLocaleString('en-US')}`;
const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || '';

export default function MixLabPartnership() {
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(null); // { ref, status, emailed }
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await supabase.rpc('mixlab_partner_availability');
        if (alive && Array.isArray(data)) setAvailability(data);
      } catch {
        /* availability is a nice-to-have; the form still works without it */
      }
    })();
    return () => { alive = false; };
  }, []);

  const spotsLeft = (cat, pkg) => {
    const row = availability.find((r) => r.category === cat && r.package === pkg);
    if (!row) return null;
    return Math.max(0, row.capacity - row.taken);
  };
  const isFull = (cat, pkg) => spotsLeft(cat, pkg) === 0;

  const selectedPackage = PACKAGES.find((p) => p.key === form.package);
  const selectedFull = form.category && form.package && isFull(form.category, form.package);

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function startWithPackage(pkgKey) {
    set('package', pkgKey);
    scrollToForm();
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function validate(whichStep) {
    const e = {};
    if (whichStep === 0) {
      if (form.business_name.trim().length < 2) e.business_name = 'Enter your business or organization name.';
      if (form.contact_name.trim().length < 3 || !form.contact_name.trim().includes(' ')) e.contact_name = 'Enter your first and last name.';
      if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.';
      if (!URLISH_RE.test(form.website.trim())) e.website = 'Enter a website or social media link.';
      if (form.location.trim().length < 2) e.location = 'Enter your city and state or country.';
      if (form.description.trim().length < 10) e.description = 'Tell us a little about your business (at least a sentence).';
    }
    if (whichStep === 1) {
      if (!form.category) e.category = 'Choose a category.';
      if (!form.package) e.package = 'Choose a package.';
      if (form.connection.trim().length < 10) e.connection = 'Tell us how your business connects with this category or The Mix Lab community.';
    }
    if (whichStep === 2) {
      if (!(form.ack_application && form.ack_no_reservation && form.ack_benefits)) e.acks = 'Please check all three acknowledgments to continue.';
    }
    return e;
  }

  function focusFirstError(e) {
    const first = Object.keys(e)[0];
    if (!first) return;
    window.requestAnimationFrame(() => {
      const el = document.getElementById(`mlp-${first}`) || document.getElementById('mlp-error-summary');
      el?.focus?.();
    });
  }

  function next() {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    setStep((s) => s + 1);
    window.requestAnimationFrame(() => headingRef.current?.focus?.());
    scrollToForm();
  }

  function back() {
    setErrors({});
    setServerError('');
    setStep((s) => Math.max(0, s - 1));
    scrollToForm();
  }

  async function submit(ev) {
    ev.preventDefault();
    if (submitting) return; // prevents accidental double-submits
    if (step < 2) { next(); return; } // pressing Enter on an earlier step just moves forward
    const e = validate(2);
    setErrors(e);
    if (Object.keys(e).length) { focusFirstError(e); return; }

    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch('/api/partner-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.fields) {
          setErrors(json.fields);
          // jump back to the step that has the problem
          const bad = Object.keys(json.fields);
          const target = [0, 1, 2].find((s) => STEP_FIELDS[s].some((f) => bad.includes(f)));
          if (target !== undefined) setStep(target);
        }
        setServerError(json.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setDone({ ref: json.ref, status: json.status, emailed: json.emailed !== false });
      setSubmitting(false);
      scrollToForm();
    } catch {
      setServerError('We could not reach the server. Your answers are still here. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  // ───────────────────────── styles ─────────────────────────
  const inputStyle = (name) => ({
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    fontSize: '16px',
    color: P.ink,
    background: P.white,
    border: `2px solid ${errors[name] ? P.error : P.ink}`,
    borderRadius: '12px',
    padding: '12px 14px',
  });

  const textInput = (name, props = {}) => (
    <input
      id={`mlp-${name}`}
      value={form[name]}
      onChange={(e) => set(name, e.target.value)}
      aria-invalid={!!errors[name]}
      aria-required={REQUIRED.includes(name) || undefined}
      aria-describedby={errors[name] ? `mlp-${name}-error` : undefined}
      style={inputStyle(name)}
      {...props}
    />
  );

  const textArea = (name, max, rows = 4) => (
    <>
      <textarea
        id={`mlp-${name}`}
        value={form[name]}
        maxLength={max}
        rows={rows}
        onChange={(e) => set(name, e.target.value)}
        aria-invalid={!!errors[name]}
        aria-required={REQUIRED.includes(name) || undefined}
        aria-describedby={errors[name] ? `mlp-${name}-error` : undefined}
        style={{ ...inputStyle(name), resize: 'vertical' }}
      />
      <div style={{ ...hint, textAlign: 'right' }}>{form[name].length}/{max}</div>
    </>
  );

  const radioCardStyle = (selected, bg) => ({
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    padding: '14px',
    borderRadius: '16px',
    background: selected ? bg : P.white,
    border: `2px solid ${P.ink}`,
    boxShadow: selected ? `3px 3px 0 ${P.ink}` : 'none',
    cursor: 'pointer',
  });

  const progress = useMemo(() => (
    <div aria-label={`Step ${step + 1} of 3: ${STEP_TITLES[step]}`} style={{ marginBottom: space.lg }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {STEP_TITLES.map((t, i) => (
          <div key={t} style={{ flex: 1, height: '8px', borderRadius: '99px', background: i <= step ? P.cobalt : P.white, border: `2px solid ${P.ink}` }} />
        ))}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.04em', color: P.ink }}>
        STEP {step + 1} OF 3 — {STEP_TITLES[step].toUpperCase()}
      </div>
    </div>
  ), [step]);

  const errorKeys = Object.keys(errors).filter((k) => errors[k]);

  // ───────────────────────── render ─────────────────────────
  return (
    <>
      {/* ───────────── INFO ───────────── */}
      <section id="community-partnership" style={{ ...section, background: P.butter }}>
        <div style={container}>
          <span style={{ ...pill, background: P.white }}>COMMUNITY PARTNERSHIP</span>
          <h2 style={{ ...h2, color: P.ink, margin: `${space.md} 0 ${space.sm}`, maxWidth: '720px' }}>
            Become a Community Partner.
          </h2>
          <p style={{ ...bodyLg, color: P.inkSoft, maxWidth: '760px', marginBottom: space.sm }}>
            Introduce your business to The Mix Lab community during Miami Art Week. Community Partners
            receive a listing in our mobile-friendly Digital Experience Guide, which attendees can access
            through check-in, QR signage and event communications.
          </p>
          <p style={{ ...body, color: P.inkSoft, maxWidth: '760px', marginBottom: space.lg }}>
            A paid directory partnership for small businesses, emerging brands and community organizations.
            Presented by GlobalLYNK, AmpSpot &amp; NFNTE Capital.
          </p>

          <h3 style={{ ...h3, color: P.ink, fontSize: '18px', marginBottom: space.sm }}>Four categories</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: space.md, marginBottom: space.xl }}>
            {CATEGORIES.map((c) => (
              <div key={c.key} style={{ ...poster, background: c.bg, borderRadius: '18px', padding: space.md }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', color: P.ink }}>{c.label}</div>
              </div>
            ))}
          </div>

          <h3 style={{ ...h3, color: P.ink, fontSize: '18px', marginBottom: space.sm }}>Two packages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: space.lg, marginBottom: space.md }}>
            {PACKAGES.map((p) => (
              <div key={p.key} style={{ ...poster, background: p.bg, borderRadius: '22px', padding: space.lg, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.04em', color: P.ink }}>{p.name.toUpperCase()}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '40px', color: P.ink, margin: '4px 0 12px' }}>{money(p.price)}</div>
                <ul style={{ margin: '0 0 16px', paddingLeft: '20px', color: P.ink, display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                  {p.benefits.map((b) => (
                    <li key={b} style={{ fontSize: '15px' }}>{b}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => startWithPackage(p.key)}
                  style={{ ...buttonPrimary, background: P.yellow, color: P.ink, border: `2px solid ${P.ink}`, boxShadow: `4px 4px 0 ${P.ink}`, cursor: 'pointer', justifyContent: 'center' }}
                >
                  Apply for {p.name} →
                </button>
              </div>
            ))}
          </div>

          <p style={{ ...body, color: P.ink, fontSize: '14px', marginBottom: '6px' }}>
            <strong>Availability:</strong> three Standard placements and one Featured placement per category, 16 placements in all across the four categories.
          </p>
          <p style={{ ...body, color: P.inkSoft, fontSize: '14px', marginBottom: space.md }}>
            Featured partners get top placement within their category. Other businesses can participate in the same category.
          </p>

          {availability.length > 0 && (
            <div style={{ overflowX: 'auto', marginBottom: space.md }}>
              <table style={{ borderCollapse: 'collapse', background: P.white, border: `2px solid ${P.ink}`, borderRadius: '12px', fontSize: '14px', color: P.ink, minWidth: '440px' }}>
                <caption style={{ textAlign: 'left', fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.03em', padding: '8px 0', color: P.ink }}>PLACEMENTS STILL OPEN</caption>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left', padding: '8px 12px', borderBottom: `2px solid ${P.ink}` }}>Category</th>
                    <th scope="col" style={{ textAlign: 'left', padding: '8px 12px', borderBottom: `2px solid ${P.ink}` }}>Standard</th>
                    <th scope="col" style={{ textAlign: 'left', padding: '8px 12px', borderBottom: `2px solid ${P.ink}` }}>Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.key}>
                      <th scope="row" style={{ textAlign: 'left', fontWeight: 600, padding: '8px 12px', borderBottom: `1px solid ${P.sky}` }}>{c.label}</th>
                      {['standard', 'featured'].map((pk) => {
                        const left = spotsLeft(c.key, pk);
                        return (
                          <td key={pk} style={{ padding: '8px 12px', borderBottom: `1px solid ${P.sky}` }}>
                            {left === null ? '—' : left === 0 ? 'Full — free waitlist' : `${left} open`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ ...body, color: P.inkSoft, fontSize: '14px', maxWidth: '760px', marginBottom: space.md }}>
            Community Partnerships do not include activation space, speaking opportunities, dedicated social posts,
            stage mentions or event naming rights. For larger sponsorships or custom activations, contact{' '}
            <a href={`mailto:${CONFIG.contactEmail}`} style={{ color: P.cobalt }}>{CONFIG.contactEmail}</a>.
          </p>

          <div style={{ marginBottom: space.lg }}>
            <button
              type="button"
              onClick={scrollToForm}
              style={{ ...buttonPrimary, background: P.yellow, color: P.ink, border: `2px solid ${P.ink}`, boxShadow: `4px 4px 0 ${P.ink}`, cursor: 'pointer' }}
            >
              APPLY TO BECOME A COMMUNITY PARTNER
            </button>
          </div>

          <div style={{ ...poster, background: P.white, borderRadius: '18px', padding: space.md }}>
            <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.04em', color: P.ink, marginBottom: '10px' }}>HOW IT WORKS</div>
            <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 10px', listStyle: 'none', margin: 0, padding: 0 }}>
              {FLOW.map((f, i) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: P.ink }}>
                  <span style={{ background: i === 0 ? P.yellow : P.sky, border: `2px solid ${P.ink}`, borderRadius: '999px', padding: '4px 12px' }}>{f}</span>
                  {i < FLOW.length - 1 && <span aria-hidden="true">→</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── APPLICATION FORM ───────────── */}
      <section ref={formRef} id="community-partner-application" style={{ ...section, background: P.lilac }}>
        <div style={{ ...container, maxWidth: '720px' }}>
          <span style={{ ...pill, background: P.white }}>APPLY</span>
          <h2 ref={headingRef} tabIndex={-1} style={{ ...h2, color: P.ink, margin: `${space.md} 0 ${space.sm}`, outline: 'none' }}>
            Community Partner application
          </h2>
          <p style={{ ...body, color: P.inkSoft, marginBottom: space.lg }}>
            Takes about five minutes. Submitting is free and does not reserve a placement. No payment is due at this stage.
          </p>

          <div style={{ ...poster, background: P.white, borderRadius: '24px', padding: space.lg }}>
            {done ? (
              <div role="status" aria-live="polite">
                <h3 style={{ ...h3, color: P.ink, fontSize: '24px', marginBottom: space.sm }}>Application received.</h3>
                <p style={{ ...body, color: P.ink, marginBottom: space.sm }}>
                  Thank you for your interest in joining The Mix Lab as a Community Partner. Our team will review your
                  application and contact you with next steps. No payment is due at this stage.
                </p>
                {done.status === 'waitlisted' && (
                  <p style={{ ...body, color: P.ink, marginBottom: space.sm }}>
                    <strong>That placement is currently full, so you&apos;ve been added to our free waitlist.</strong> We&apos;ll
                    reach out if a spot opens or if there&apos;s an alternative that fits.
                  </p>
                )}
                <p style={{ ...body, color: P.ink, marginBottom: space.sm }}>
                  Your application reference: <strong>{done.ref}</strong>
                </p>
                <p style={{ ...body, color: P.inkSoft, fontSize: '14px' }}>
                  {done.emailed
                    ? 'A confirmation email is on its way. If you don’t see it, check your spam folder.'
                    : 'We saved your application, but we couldn’t send the confirmation email. Keep your reference number and contact '}
                  {!done.emailed && <a href={`mailto:${CONFIG.contactEmail}`} style={{ color: P.cobalt }}>{CONFIG.contactEmail}</a>}
                  {!done.emailed && ' if you don’t hear from us.'}
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                {progress}

                {(errorKeys.length > 0 || serverError) && (
                  <div
                    id="mlp-error-summary"
                    tabIndex={-1}
                    role="alert"
                    style={{ border: `2px solid ${P.error}`, background: '#FFF0F2', color: P.error, borderRadius: '12px', padding: '12px 14px', marginBottom: space.md, fontSize: '14px' }}
                  >
                    {serverError || 'Please fix the highlighted fields below.'}
                  </div>
                )}

                {/* honeypot — real people never see or fill this */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                  <label htmlFor="mlp-hp">Leave this empty</label>
                  <input id="mlp-hp" tabIndex={-1} autoComplete="off" value={form.hp} onChange={(e) => set('hp', e.target.value)} />
                </div>

                {/* ───── STEP 1 ───── */}
                {step === 0 && (
                  <div>
                    <Field name="business_name" error={errors.business_name} label="Business or organization name" required>
                      {textInput('business_name', { autoComplete: 'organization', maxLength: 120 })}
                    </Field>
                    <Field name="contact_name" error={errors.contact_name} label="Contact first and last name" required>
                      {textInput('contact_name', { autoComplete: 'name', maxLength: 100 })}
                    </Field>
                    <Field name="email" error={errors.email} label="Contact email" required>
                      {textInput('email', { type: 'email', autoComplete: 'email', inputMode: 'email', maxLength: 160 })}
                    </Field>
                    <Field name="website" error={errors.website} label="Website or primary social media URL" required>
                      {textInput('website', { autoComplete: 'url', inputMode: 'url', maxLength: 200, placeholder: 'yourbusiness.com or instagram.com/yourbusiness' })}
                    </Field>
                    <Field name="location" error={errors.location} label="City and state/country" required>
                      {textInput('location', { autoComplete: 'address-level2', maxLength: 100, placeholder: 'Miami, FL' })}
                    </Field>
                    <Field name="description" error={errors.description} label="Short description of the business" required hintText="Up to 500 characters.">
                      {textArea('description', 500)}
                    </Field>
                    <Field name="phone" error={errors.phone} label="Contact phone number">
                      {textInput('phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel', maxLength: 30 })}
                    </Field>
                    <Field name="instagram" error={errors.instagram} label="Instagram handle">
                      {textInput('instagram', { maxLength: 60, placeholder: '@yourbusiness' })}
                    </Field>
                  </div>
                )}

                {/* ───── STEP 2 ───── */}
                {step === 1 && (
                  <div>
                    <fieldset style={{ border: 'none', padding: 0, margin: `0 0 ${space.md}` }} aria-describedby={errors.category ? 'mlp-category-error' : undefined}>
                      <legend id="mlp-category" tabIndex={-1} style={{ ...labelStyle, padding: 0 }}>
                        Preferred category <span aria-hidden="true">*</span>
                      </legend>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {CATEGORIES.map((c) => (
                          <label key={c.key} style={radioCardStyle(form.category === c.key, c.bg)}>
                            <input
                              type="radio"
                              name="category"
                              value={c.key}
                              checked={form.category === c.key}
                              onChange={() => set('category', c.key)}
                              style={{ marginTop: '4px' }}
                            />
                            <span style={{ color: P.ink, fontSize: '15px' }}>{c.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.category && <div id="mlp-category-error" role="alert" style={errorText}>{errors.category}</div>}
                    </fieldset>

                    <fieldset style={{ border: 'none', padding: 0, margin: `0 0 ${space.md}` }} aria-describedby={errors.package ? 'mlp-package-error' : undefined}>
                      <legend id="mlp-package" tabIndex={-1} style={{ ...labelStyle, padding: 0 }}>
                        Preferred package <span aria-hidden="true">*</span>
                      </legend>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        {PACKAGES.map((p) => {
                          const full = form.category ? isFull(form.category, p.key) : false;
                          return (
                            <label key={p.key} style={radioCardStyle(form.package === p.key, p.bg)}>
                              <input
                                type="radio"
                                name="package"
                                value={p.key}
                                checked={form.package === p.key}
                                onChange={() => set('package', p.key)}
                                style={{ marginTop: '4px' }}
                              />
                              <span style={{ color: P.ink, fontSize: '15px' }}>
                                <strong>{p.name} — {money(p.price)}</strong>
                                {full && <span style={{ color: P.error }}> · Full in this category — you can join the free waitlist</span>}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.package && <div id="mlp-package-error" role="alert" style={errorText}>{errors.package}</div>}
                    </fieldset>

                    {selectedPackage && (
                      <div style={{ background: selectedPackage.bg, border: `2px solid ${P.ink}`, borderRadius: '16px', padding: space.md, marginBottom: space.md }}>
                        <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.04em', color: P.ink }}>
                          YOUR SELECTION: {selectedPackage.name.toUpperCase()} — {money(selectedPackage.price)}
                        </div>
                        <ul style={{ margin: '8px 0 8px', paddingLeft: '20px', color: P.ink, fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {selectedPackage.benefits.map((b) => <li key={b}>{b}</li>)}
                        </ul>
                        <div style={{ color: P.inkSoft, fontSize: '13px' }}>
                          Not included: activation space, speaking opportunities, dedicated social posts, stage mentions or event naming rights.
                        </div>
                        {selectedFull && (
                          <div role="status" style={{ color: P.error, fontSize: '14px', marginTop: '8px' }}>
                            This placement is currently full. You can still apply and we&apos;ll add you to the free waitlist, or choose an open category or package above.
                          </div>
                        )}
                      </div>
                    )}

                    <Field name="connection" error={errors.connection} label="How does your business connect with this category or The Mix Lab community?" required hintText="Up to 500 characters.">
                      {textArea('connection', 500)}
                    </Field>

                    <fieldset style={{ border: 'none', padding: 0, margin: `0 0 ${space.md}` }}>
                      <legend style={{ ...labelStyle, padding: 0 }}>
                        Would you consider another category or package if your first choice is unavailable? <span style={{ color: P.inkSoft }}>(optional)</span>
                      </legend>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {[['yes', 'Yes'], ['no', 'No'], ['not_sure', 'Not sure']].map(([v, l]) => (
                          <label key={v} style={{ display: 'flex', gap: '6px', alignItems: 'center', color: P.ink, fontSize: '15px' }}>
                            <input type="radio" name="flexible" value={v} checked={form.flexible === v} onChange={() => set('flexible', v)} /> {l}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset style={{ border: 'none', padding: 0, margin: `0 0 ${space.md}` }}>
                      <legend style={{ ...labelStyle, padding: 0 }}>
                        Would you like to provide an attendee offer or resource? <span style={{ color: P.inkSoft }}>(optional)</span>
                      </legend>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {[['yes', 'Yes'], ['no', 'No'], ['not_sure', 'Not sure']].map(([v, l]) => (
                          <label key={v} style={{ display: 'flex', gap: '6px', alignItems: 'center', color: P.ink, fontSize: '15px' }}>
                            <input type="radio" name="offer_choice" value={v} checked={form.offer_choice === v} onChange={() => set('offer_choice', v)} /> {l}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {form.offer_choice === 'yes' && (
                      <Field name="offer_description" error={errors.offer_description} label="Briefly describe the offer or resource" hintText="Up to 500 characters. You can add details later.">
                        {textArea('offer_description', 500, 3)}
                      </Field>
                    )}

                    <Field name="notes" error={errors.notes} label="Additional questions or notes" hintText="Up to 500 characters.">
                      {textArea('notes', 500, 3)}
                    </Field>
                  </div>
                )}

                {/* ───── STEP 3 ───── */}
                {step === 2 && (
                  <div>
                    <div style={{ background: P.butter, border: `2px solid ${P.ink}`, borderRadius: '16px', padding: space.md, marginBottom: space.md, color: P.ink, fontSize: '15px' }}>
                      <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.04em', marginBottom: '8px' }}>YOUR APPLICATION</div>
                      <div><strong>{form.business_name}</strong></div>
                      <div>{form.contact_name} · {form.email}</div>
                      <div style={{ marginTop: '8px' }}>Category: <strong>{catLabel(form.category)}</strong></div>
                      <div>Package: <strong>{selectedPackage?.name} — {selectedPackage ? money(selectedPackage.price) : ''}</strong></div>
                      {selectedFull && <div style={{ color: P.error, marginTop: '6px' }}>This placement is currently full, so this application will join the free waitlist.</div>}
                      <button type="button" onClick={() => setStep(0)} style={{ ...buttonGhost, marginTop: '12px', color: P.cobalt, borderColor: P.cobalt, cursor: 'pointer' }}>
                        Edit my answers
                      </button>
                    </div>

                    <fieldset id="mlp-acks" tabIndex={-1} style={{ border: 'none', padding: 0, margin: `0 0 ${space.md}` }}>
                      <legend style={{ ...labelStyle, padding: 0 }}>Please confirm <span aria-hidden="true">*</span></legend>
                      {[
                        ['ack_application', 'I understand this is an application and participation is subject to approval.'],
                        ['ack_no_reservation', 'I understand submitting an application does not reserve a placement. My placement is secured after approval and payment.'],
                        ['ack_benefits', 'I have reviewed the benefits and exclusions of my selected package.'],
                      ].map(([name, text]) => (
                        <label key={name} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: P.ink, fontSize: '15px', marginBottom: '10px' }}>
                          <input type="checkbox" checked={form[name]} onChange={(e) => { set(name, e.target.checked); setErrors((er) => ({ ...er, acks: undefined })); }} style={{ marginTop: '4px' }} />
                          <span>{text}</span>
                        </label>
                      ))}
                      {errors.acks && <div role="alert" style={errorText}>{errors.acks}</div>}
                    </fieldset>

                    <div style={{ background: P.sky, border: `2px solid ${P.ink}`, borderRadius: '12px', padding: '12px 14px', color: P.ink, fontSize: '13px', marginBottom: space.md }}>
                      <strong>Privacy:</strong> We use the information you submit to review your application and coordinate
                      participation. We don&apos;t publish it, and we don&apos;t sell it. Your contact details stay private unless you
                      choose to include them in your public listing later.
                      {CONFIG.privacyUrl && <> <a href={CONFIG.privacyUrl} style={{ color: P.cobalt }}>Privacy policy</a>.</>}
                    </div>

                    <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: P.ink, fontSize: '14px', marginBottom: space.md }}>
                      <input type="checkbox" checked={form.marketing_opt_in} onChange={(e) => set('marketing_opt_in', e.target.checked)} style={{ marginTop: '4px' }} />
                      <span>(Optional) Send me occasional news about The Mix Lab and GlobalLYNK events. You can unsubscribe at any time.</span>
                    </label>
                  </div>
                )}

                {/* ───── buttons ───── */}
                <div style={{ display: 'flex', gap: space.sm, flexWrap: 'wrap', marginTop: space.md }}>
                  {step > 0 && (
                    <button type="button" onClick={back} disabled={submitting} style={{ ...buttonGhost, color: P.ink, borderColor: P.ink, cursor: 'pointer' }}>
                      ← Back
                    </button>
                  )}
                  {step < 2 ? (
                    <button type="button" onClick={next} style={{ ...buttonPrimary, background: P.yellow, color: P.ink, border: `2px solid ${P.ink}`, boxShadow: `4px 4px 0 ${P.ink}`, cursor: 'pointer' }}>
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{ ...buttonPrimary, background: P.yellow, color: P.ink, border: `2px solid ${P.ink}`, boxShadow: `4px 4px 0 ${P.ink}`, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}
                    >
                      {submitting ? 'SUBMITTING…' : 'SUBMIT APPLICATION'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}