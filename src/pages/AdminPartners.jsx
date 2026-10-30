import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  color, eyebrow, h1, h2, body, card, radius, buttonPrimary, buttonGhost, container, space, font,
} from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// The Mix Lab — Community Partner applications (admin only)
// Payment is handled outside the site (you send the Square link yourself);
// this page tracks it: Approve → (you send the Square link) → Mark as paid.
// ──────────────────────────────────────────────────────────────────────────

const CATEGORIES = {
  health_wellness: 'Health & Wellness',
  ai_tech_creative: 'AI, Technology & Creative Futures',
  business_financial: 'Business Development & Financial Growth',
  community_social: 'Community & Social Capital',
};
const PACKAGES = {
  standard: { label: 'Standard', price: 500, capacity: 3 },
  featured: { label: 'Featured', price: 1000, capacity: 1 },
};
const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under review',
  more_info_requested: 'More information requested',
  approved_awaiting_payment: 'Approved — awaiting payment',
  paid_materials_needed: 'Paid — materials needed',
  materials_submitted: 'Materials submitted',
  ready_to_publish: 'Ready to publish',
  published: 'Published',
  waitlisted: 'Waitlisted',
  declined: 'Declined',
  withdrawn: 'Withdrawn',
};
// A placement counts against capacity once an application is approved.
const TAKEN = ['approved_awaiting_payment', 'paid_materials_needed', 'materials_submitted', 'ready_to_publish', 'published'];
const LATE_STATUSES = ['materials_submitted', 'ready_to_publish', 'published'];
const money = (n) => `$${Number(n).toLocaleString('en-US')}`;
const fmt = (iso) => (iso ? new Date(iso).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—');
const firstName = (n) => String(n || '').split(' ')[0];

function randomToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function mailto(to, subject, bodyText) {
  return `mailto:${encodeURIComponent(to).replace('%40', '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}

export default function AdminPartners() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  const [params, setParams] = useSearchParams();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fPackage, setFPackage] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    const all = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from('mixlab_partner_applications')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + 999);
      if (error) { setMsg('Error loading applications: ' + error.message); break; }
      all.push(...data);
      if (data.length < 1000) break;
    }
    setRows(all);
    setLoading(false);
    const ref = params.get('ref');
    if (ref) {
      const hit = all.find((r) => r.ref === ref);
      if (hit) setSelectedId(hit.id);
    }
  }

  async function save(id, patch, okMsg = 'Saved.') {
    setMsg('');
    const { data, error } = await supabase
      .from('mixlab_partner_applications').update(patch).eq('id', id).select('*').single();
    if (error) { setMsg('Error: ' + error.message); return false; }
    setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
    setMsg(okMsg);
    return true;
  }

  // How many placements are already taken for a category + package (optionally ignoring one application)
  function taken(cat, pkg, ignoreId) {
    return rows.filter((r) =>
      r.id !== ignoreId && TAKEN.includes(r.status) &&
      (r.approved_category || r.category) === cat && (r.approved_package || r.package) === pkg).length;
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (fCategory && (r.approved_category || r.category) !== fCategory) return false;
      if (fPackage && (r.approved_package || r.package) !== fPackage) return false;
      if (fStatus && r.status !== fStatus) return false;
      if (needle) {
        const hay = [r.ref, r.business_name, r.contact_name, r.email, r.website, r.location].join(' ').toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [rows, q, fCategory, fPackage, fStatus]);

  const statusCounts = useMemo(() => {
    const c = {};
    rows.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [rows]);

  const selected = rows.find((r) => r.id === selectedId) || null;

  function exportCsv() {
    const cols = [
      'ref', 'created_at', 'status', 'business_name', 'contact_name', 'email', 'phone', 'website', 'instagram', 'location',
      'description', 'category', 'package', 'approved_category', 'approved_package', 'amount_due', 'alt_offered', 'alt_accepted',
      'connection', 'flexible', 'offer_choice', 'offer_description', 'notes', 'marketing_opt_in',
      'paid_at', 'amount_paid', 'payment_note', 'materials_submitted_at', 'internal_notes',
    ];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(',')].concat(filtered.map((r) => cols.map((c) => esc(r[c])).join(','))).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `mixlab-partner-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isAdmin) {
    return (
      <div style={{ ...container, padding: `${space.xxl} 0` }}>
        <h1 style={{ ...h1, fontSize: '32px' }}>Admins only</h1>
        <p style={body}>Sign in with an admin account to review Community Partner applications.</p>
      </div>
    );
  }

  const select = { fontFamily: font.mono, fontSize: '13px', padding: '10px 12px', borderRadius: radius.sm, border: `1px solid ${color.line}`, background: color.bg, color: color.white };

  return (
    <div style={{ ...container, padding: `${space.xl} 0 ${space.xxl}` }}>
      <div style={eyebrow}><span>Admin · The Mix Lab</span></div>
      <h1 style={{ ...h1, fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: space.sm }}>Community Partner applications</h1>
      <p style={{ ...body, marginBottom: space.md }}>
        Applicant details are private. Payment happens outside the site: approve here, send your Square link, then mark it paid.
      </p>
      {msg && <div role="status" style={{ ...card, padding: space.sm, marginBottom: space.md, fontSize: '14px' }}>{msg}</div>}

      {/* capacity */}
      <div style={{ ...card, padding: space.md, marginBottom: space.md }}>
        <h2 style={{ ...h2, fontSize: '16px', marginBottom: space.sm }}>Placements taken (approved or paid)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.sm }}>
          {Object.entries(CATEGORIES).map(([ck, cl]) => (
            <div key={ck} style={{ fontSize: '13px' }}>
              <div style={{ fontFamily: font.mono, color: color.cyanDim, marginBottom: '4px' }}>{cl}</div>
              <div>Standard: <strong>{taken(ck, 'standard')}/3</strong> · Featured: <strong>{taken(ck, 'featured')}/1</strong></div>
            </div>
          ))}
        </div>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', gap: space.sm, flexWrap: 'wrap', marginBottom: space.sm, alignItems: 'center' }}>
        <input
          aria-label="Search applications"
          placeholder="Search name, email, reference…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ ...select, minWidth: '240px', flex: 1 }}
        />
        <select aria-label="Filter by category" value={fCategory} onChange={(e) => setFCategory(e.target.value)} style={select}>
          <option value="">All categories</option>
          {Object.entries(CATEGORIES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select aria-label="Filter by package" value={fPackage} onChange={(e) => setFPackage(e.target.value)} style={select}>
          <option value="">All packages</option>
          <option value="standard">Standard</option>
          <option value="featured">Featured</option>
        </select>
        <select aria-label="Filter by status" value={fStatus} onChange={(e) => setFStatus(e.target.value)} style={select}>
          <option value="">All statuses ({rows.length})</option>
          {Object.entries(STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l} ({statusCounts[k] || 0})</option>)}
        </select>
        <button type="button" onClick={exportCsv} style={{ ...buttonGhost, cursor: 'pointer' }}>Export CSV ({filtered.length})</button>
        <button type="button" onClick={load} style={{ ...buttonGhost, cursor: 'pointer' }}>Refresh</button>
      </div>

      {loading ? (
        <p style={body}>Loading…</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)', gap: space.md, alignItems: 'start' }} className="mlp-admin-grid">
          {/* list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filtered.length === 0 && <p style={body}>No applications match.</p>}
            {filtered.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => { setSelectedId(r.id); setParams({ ref: r.ref }, { replace: true }); }}
                style={{
                  ...card, textAlign: 'left', padding: space.sm, cursor: 'pointer',
                  border: `1px solid ${r.id === selectedId ? color.cyan : color.line}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <strong style={{ fontSize: '15px', color: color.white }}>{r.business_name}</strong>
                  <span style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim }}>{r.ref}</span>
                </div>
                <div style={{ fontSize: '13px', color: color.white }}>
                  {CATEGORIES[r.approved_category || r.category]} · {PACKAGES[r.approved_package || r.package].label}
                </div>
                <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim, marginTop: '4px' }}>
                  {STATUS_LABELS[r.status]} · {fmt(r.created_at)}
                </div>
              </button>
            ))}
          </div>

          {/* detail */}
          <div>
            {selected ? (
              <Detail
                key={selected.id}
                row={selected}
                save={save}
                taken={taken}
                setMsg={setMsg}
              />
            ) : (
              <div style={{ ...card, padding: space.lg }}><p style={body}>Select an application to review it.</p></div>
            )}
          </div>
        </div>
      )}

      <style>{`@media (max-width: 900px) { .mlp-admin-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function Detail({ row, save, taken, setMsg }) {
  const [notes, setNotes] = useState(row.internal_notes || '');
  const [altCat, setAltCat] = useState(row.approved_category || row.category);
  const [altPkg, setAltPkg] = useState(row.approved_package || row.package);
  const [paidAmount, setPaidAmount] = useState(String(row.amount_due || PACKAGES[row.approved_package || row.package].price));
  const [paidNote, setPaidNote] = useState(row.payment_note || '');
  const [busy, setBusy] = useState(false);

  const first = firstName(row.contact_name);
  const effCat = row.approved_category || row.category;
  const effPkg = row.approved_package || row.package;
  const changed = altCat !== row.category || altPkg !== row.package;

  async function act(patch, okMsg) {
    setBusy(true);
    await save(row.id, patch, okMsg);
    setBusy(false);
  }

  function approve() {
    const cat = row.alt_offered ? altCat : row.category;
    const pkg = row.alt_offered ? altPkg : row.package;
    if (row.alt_offered && (cat !== row.category || pkg !== row.package) && !row.alt_accepted) {
      return setMsg('The applicant has to accept the alternative before you approve it. Tick "Applicant accepted the alternative" first.');
    }
    if (taken(cat, pkg, row.id) >= PACKAGES[pkg].capacity) {
      return setMsg(`${PACKAGES[pkg].label} in ${CATEGORIES[cat]} is full (${PACKAGES[pkg].capacity}/${PACKAGES[pkg].capacity}). Waitlist them or offer an alternative.`);
    }
    return act(
      { status: 'approved_awaiting_payment', approved_category: cat, approved_package: pkg, amount_due: PACKAGES[pkg].price },
      'Approved. Now send them your Square payment link, then mark it paid here.'
    );
  }

  function offerAlternative() {
    if (!changed) return setMsg('Pick a different category or package first.');
    if (taken(altCat, altPkg, row.id) >= PACKAGES[altPkg].capacity) {
      return setMsg('That alternative is full too. Pick one with space.');
    }
    return act(
      { alt_offered: true, alt_accepted: false, approved_category: altCat, approved_package: altPkg, amount_due: PACKAGES[altPkg].price, status: 'under_review' },
      'Alternative recorded. Email it to them, and tick "accepted" once they agree.'
    );
  }

  function markPaid() {
    const amount = Math.round(Number(paidAmount));
    if (!amount || amount < 0) return setMsg('Enter the amount paid.');
    return act(
      {
        status: 'paid_materials_needed',
        paid_at: new Date().toISOString(),
        amount_paid: amount,
        payment_note: paidNote || null,
        materials_token: row.materials_token || randomToken(),
      },
      'Marked as paid. Placement secured.'
    );
  }

  const approvedCatLabel = CATEGORIES[effCat];
  const approvedPkgLabel = PACKAGES[effPkg].label;

  const emailMore = mailto(row.email, `More information for your Mix Lab Community Partner application (${row.ref})`,
    `Hi ${first},\n\nThanks for applying to become a Community Partner for The Mix Lab (reference ${row.ref}). Before we can finish reviewing your application, we need a bit more information:\n\n[add your questions]\n\nThanks,\nThe Mix Lab team`);
  const emailAlt = mailto(row.email, `An option for your Mix Lab Community Partner application (${row.ref})`,
    `Hi ${first},\n\nThank you for applying (reference ${row.ref}). Your first choice, ${PACKAGES[row.package].label} in ${CATEGORIES[row.category]}, isn't available, but we can offer:\n\n${PACKAGES[altPkg].label} (${money(PACKAGES[altPkg].price)}) in ${CATEGORIES[altCat]}\n\nIf you'd like to accept, reply to this email and we'll move to the next step. Nothing is secured until approval and payment.\n\nThe Mix Lab team`);
  const emailApproved = mailto(row.email, `You're approved: Mix Lab Community Partner (${row.ref})`,
    `Hi ${first},\n\nGood news: your application is approved for:\n\n${approvedPkgLabel} (${money(PACKAGES[effPkg].price)}) in ${approvedCatLabel}\n\nYour placement is secured once payment is received. Here's your payment link:\n\n[paste your Square link here]\n\n[add payment deadline and refund terms]\n\nAfter payment, we'll send a link to submit your listing materials.\n\nThe Mix Lab team`);
  const emailWait = mailto(row.email, `Your Mix Lab Community Partner application (${row.ref})`,
    `Hi ${first},\n\nThank you for applying. That placement is currently full, so we've added you to our free waitlist. We'll reach out if a spot opens or an alternative is available.\n\nThe Mix Lab team`);
  const emailDecline = mailto(row.email, `Your Mix Lab Community Partner application (${row.ref})`,
    `Hi ${first},\n\nThank you for your interest in The Mix Lab. After review, we aren't able to offer you a Community Partner placement at this time.\n\n[optional note]\n\nThe Mix Lab team`);

  const btn = { ...buttonGhost, cursor: busy ? 'wait' : 'pointer', fontSize: '13px' };
  const primary = { ...buttonPrimary, cursor: busy ? 'wait' : 'pointer', fontSize: '13px' };
  const field = { fontFamily: font.mono, fontSize: '13px', padding: '8px 10px', borderRadius: radius.sm, border: `1px solid ${color.line}`, background: color.bg, color: color.white };
  const row2 = (label, value) => (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim }}>{label}</div>
      <div style={{ fontSize: '14px', color: color.white, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{value || '—'}</div>
    </div>
  );

  return (
    <div style={{ ...card, padding: space.md }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <h2 style={{ ...h2, fontSize: '22px' }}>{row.business_name}</h2>
        <span style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim }}>{row.ref}</span>
      </div>
      <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan, margin: '4px 0 12px' }}>
        {STATUS_LABELS[row.status]}
        {row.amount_due ? ` · due ${money(row.amount_due)}` : ''}
        {row.paid_at ? ` · paid ${money(row.amount_paid)} on ${fmt(row.paid_at)}` : ''}
      </div>

      {/* the application */}
      {row2('Contact', `${row.contact_name} · ${row.email}${row.phone ? ' · ' + row.phone : ''}`)}
      {row2('Website / social', row.website + (row.instagram ? ` · IG ${row.instagram}` : ''))}
      {row2('Location', row.location)}
      {row2('Applied for', `${PACKAGES[row.package].label} (${money(PACKAGES[row.package].price)}) · ${CATEGORIES[row.category]}`)}
      {row.approved_category && (row.approved_category !== row.category || row.approved_package !== row.package) &&
        row2('Approved / offered', `${PACKAGES[row.approved_package].label} · ${CATEGORIES[row.approved_category]}${row.alt_offered ? (row.alt_accepted ? ' (applicant accepted)' : ' (awaiting their acceptance)') : ''}`)}
      {row2('About the business', row.description)}
      {row2('Connection to category / Mix Lab', row.connection)}
      {row2('Flexible on category/package?', row.flexible)}
      {row2('Attendee offer', [row.offer_choice, row.offer_description].filter(Boolean).join(' — '))}
      {row2('Notes from applicant', row.notes)}
      {row2('Marketing opt-in', row.marketing_opt_in ? 'Yes' : 'No')}
      {row2('Submitted', fmt(row.created_at))}
      {row2('Emails', `Applicant confirmation: ${row.confirmation_sent_at ? 'sent' : 'NOT sent'} · Team notice: ${row.team_notified_at ? 'sent' : 'NOT sent'}`)}

      <hr style={{ border: 0, borderTop: `1px solid ${color.line}`, margin: `${space.md} 0` }} />

      {/* actions */}
      <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: '8px' }}>REVIEW</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: space.sm }}>
        <button type="button" disabled={busy} onClick={() => act({ status: 'under_review' }, 'Marked under review.')} style={btn}>Under review</button>
        <button type="button" disabled={busy} onClick={() => act({ status: 'more_info_requested' }, 'Marked: more information requested.')} style={btn}>Request more info</button>
        <a href={emailMore} style={btn}>Email them ↗</a>
      </div>

      <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, margin: '12px 0 8px' }}>OFFER AN ALTERNATIVE</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '8px' }}>
        <select aria-label="Alternative category" value={altCat} onChange={(e) => setAltCat(e.target.value)} style={field}>
          {Object.entries(CATEGORIES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select aria-label="Alternative package" value={altPkg} onChange={(e) => setAltPkg(e.target.value)} style={field}>
          <option value="standard">Standard ({taken(altCat, 'standard', row.id)}/3 taken)</option>
          <option value="featured">Featured ({taken(altCat, 'featured', row.id)}/1 taken)</option>
        </select>
        <button type="button" disabled={busy} onClick={offerAlternative} style={btn}>Record alternative</button>
        <a href={emailAlt} style={btn}>Email the offer ↗</a>
      </div>
      {row.alt_offered && (
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px', color: color.white, marginBottom: space.sm }}>
          <input
            type="checkbox"
            checked={row.alt_accepted}
            onChange={(e) => act({ alt_accepted: e.target.checked }, e.target.checked ? 'Marked: applicant accepted.' : 'Acceptance cleared.')}
          />
          Applicant accepted the alternative (required before approval)
        </label>
      )}

      <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, margin: '12px 0 8px' }}>DECISION</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: space.sm }}>
        <button type="button" disabled={busy || TAKEN.includes(row.status)} onClick={approve} style={primary}>Approve — awaiting payment</button>
        <a href={emailApproved} style={btn}>Email approval ↗</a>
        <button type="button" disabled={busy} onClick={() => act({ status: 'waitlisted' }, 'Added to waitlist.')} style={btn}>Waitlist</button>
        <a href={emailWait} style={btn}>Email waitlist ↗</a>
        <button type="button" disabled={busy} onClick={() => act({ status: 'declined' }, 'Declined.')} style={btn}>Decline</button>
        <a href={emailDecline} style={btn}>Email decline ↗</a>
        <button type="button" disabled={busy} onClick={() => act({ status: 'withdrawn' }, 'Marked withdrawn.')} style={btn}>Withdrawn</button>
      </div>

      {row.status === 'approved_awaiting_payment' && (
        <div style={{ border: `1px solid ${color.line}`, borderRadius: radius.sm, padding: space.sm, marginBottom: space.sm }}>
          <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: '8px' }}>PAYMENT (YOU SEND THE SQUARE LINK)</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', color: color.white }}>Amount paid $ <input aria-label="Amount paid" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} style={{ ...field, width: '90px' }} /></label>
            <input aria-label="Payment note" placeholder="Square invoice # / note" value={paidNote} onChange={(e) => setPaidNote(e.target.value)} style={{ ...field, flex: 1, minWidth: '160px' }} />
            <button type="button" disabled={busy} onClick={markPaid} style={primary}>Mark as paid</button>
          </div>
        </div>
      )}

      {(row.paid_at || LATE_STATUSES.includes(row.status)) && (
        <>
          <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, margin: '12px 0 8px' }}>LISTING PIPELINE</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: space.sm }}>
            {['paid_materials_needed', 'materials_submitted', 'ready_to_publish', 'published'].map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy || row.status === s}
                onClick={() => act({ status: s, ...(s === 'materials_submitted' ? { materials_submitted_at: new Date().toISOString() } : {}) }, `Status: ${STATUS_LABELS[s]}.`)}
                style={{ ...btn, opacity: row.status === s ? 0.5 : 1 }}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: color.mutedDim }}>The self-serve materials form is coming in the next phase. Until then, collect logos and copy by email and update the status here.</div>
        </>
      )}

      <hr style={{ border: 0, borderTop: `1px solid ${color.line}`, margin: `${space.md} 0` }} />

      <label htmlFor="mlp-notes" style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim }}>INTERNAL NOTES (never shown publicly)</label>
      <textarea
        id="mlp-notes"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ ...field, width: '100%', boxSizing: 'border-box', marginTop: '6px', fontFamily: 'inherit', fontSize: '14px' }}
      />
      <div style={{ marginTop: '8px' }}>
        <button type="button" disabled={busy} onClick={() => act({ internal_notes: notes || null }, 'Notes saved.')} style={btn}>Save notes</button>
      </div>
    </div>
  );
}