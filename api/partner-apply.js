import { adminClient, emailKey, clientIp, hashIp, SITE_URL } from './_ce.js';
import { CATEGORIES, PACKAGES, TEAM_EMAIL, esc, money, sendEmail, emailShell } from './_mixlab.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URLISH_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$|^@?[\w.]{2,40}$/;
const clean = (v, max) => String(v ?? '').trim().replace(/\s+/g, ' ').slice(0, max);
const cleanLong = (v, max) => String(v ?? '').trim().slice(0, max);
const YNN = ['yes', 'no', 'not_sure'];

const TAKEN_STATUSES = ['approved_awaiting_payment', 'paid_materials_needed', 'materials_submitted', 'ready_to_publish', 'published'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const b = req.body || {};

    // Honeypot: real people leave this empty. Pretend success so bots move on.
    if (b.hp) return res.status(200).json({ ok: true, ref: 'MLP-0000', status: 'submitted' });

    const data = {
      business_name: clean(b.business_name, 120),
      contact_name: clean(b.contact_name, 100),
      email: clean(b.email, 160),
      phone: clean(b.phone, 30) || null,
      website: clean(b.website, 200),
      instagram: clean(b.instagram, 60) || null,
      location: clean(b.location, 100),
      description: cleanLong(b.description, 500),
      category: String(b.category || ''),
      package: String(b.package || ''),
      connection: cleanLong(b.connection, 500),
      flexible: YNN.includes(b.flexible) ? b.flexible : null,
      offer_choice: YNN.includes(b.offer_choice) ? b.offer_choice : null,
      offer_description: b.offer_choice === 'yes' ? cleanLong(b.offer_description, 500) || null : null,
      notes: cleanLong(b.notes, 500) || null,
      marketing_opt_in: b.marketing_opt_in === true,
    };

    // ---- validation (the form checks too; this is the real gate) ----
    const errors = {};
    if (data.business_name.length < 2) errors.business_name = 'Enter your business or organization name.';
    if (data.contact_name.length < 2 || !data.contact_name.includes(' ')) errors.contact_name = 'Enter your first and last name.';
    if (!EMAIL_RE.test(data.email)) errors.email = 'Enter a valid email address.';
    if (!URLISH_RE.test(data.website)) errors.website = 'Enter a website or social media link.';
    if (data.location.length < 2) errors.location = 'Enter your city and state or country.';
    if (data.description.length < 10) errors.description = 'Tell us a little about your business.';
    if (!CATEGORIES[data.category]) errors.category = 'Choose a category.';
    if (!PACKAGES[data.package]) errors.package = 'Choose a package.';
    if (data.connection.length < 10) errors.connection = 'Tell us how you connect with this category or The Mix Lab community.';
    if (!(b.ack_application === true && b.ack_no_reservation === true && b.ack_benefits === true)) {
      errors.acks = 'Please check all three acknowledgments.';
    }
    if (Object.keys(errors).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', fields: errors });

    const db = adminClient();
    const ipHash = hashIp(clientIp(req));
    const key = emailKey(data.email);

    // ---- abuse limit: 5 applications per connection per hour ----
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await db
      .from('mixlab_partner_applications').select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash).gte('created_at', hourAgo);
    if ((count || 0) >= 5) return res.status(429).json({ error: 'Too many submissions from this connection. Please try again later.' });

    // ---- accidental duplicate (double click / refresh): same email + business within 24h ----
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: dupes } = await db
      .from('mixlab_partner_applications').select('ref, status')
      .eq('email_key', key).ilike('business_name', data.business_name).gte('created_at', dayAgo).limit(1);
    if (dupes && dupes.length) return res.status(200).json({ ok: true, ref: dupes[0].ref, status: dupes[0].status, duplicate: true });

    // ---- capacity: if the chosen spot is already full, the application goes on the free waitlist ----
    const { count: taken } = await db
      .from('mixlab_partner_applications').select('id', { count: 'exact', head: true })
      .in('status', TAKEN_STATUSES)
      .eq('approved_category', data.category).eq('approved_package', data.package);
    // approved_* is filled when we approve, so also count approvals made without an explicit override
    const { count: takenPlain } = await db
      .from('mixlab_partner_applications').select('id', { count: 'exact', head: true })
      .in('status', TAKEN_STATUSES).is('approved_category', null)
      .eq('category', data.category).eq('package', data.package);
    const isFull = (taken || 0) + (takenPlain || 0) >= PACKAGES[data.package].capacity;
    const status = isFull ? 'waitlisted' : 'submitted';

    const { data: row, error } = await db
      .from('mixlab_partner_applications')
      .insert({
        ...data,
        email_key: key,
        ack_application: true, ack_no_reservation: true, ack_benefits: true,
        status,
        ip_hash: ipHash,
        user_agent: clean(req.headers['user-agent'], 200),
      })
      .select('id, ref, status').single();
    if (error) throw error;

    // ---- emails (a mail problem never loses the application — it is already saved) ----
    const catLabel = CATEGORIES[data.category];
    const pkg = PACKAGES[data.package];
    const waitNote = isFull
      ? 'That placement is currently full, so your application has been added to our free waitlist. We will contact you if a spot opens or an alternative is available.'
      : '';

    const confirmText = [
      `Hi ${data.contact_name.split(' ')[0]},`,
      '',
      'Application received. Thank you for your interest in joining The Mix Lab as a Community Partner.',
      '',
      `Business: ${data.business_name}`,
      `Category: ${catLabel}`,
      `Package: ${pkg.label} — ${money(pkg.price)}`,
      `Application reference: ${row.ref}`,
      '',
      ...(waitNote ? [waitNote, ''] : []),
      'What happens next: our team will review your application and contact you with next steps. No payment is due at this stage.',
      'Submitting an application does not reserve a placement. Your placement is secured only after approval and payment.',
      '',
      `Questions? Reply to this email or contact ${TEAM_EMAIL}.`,
      '',
      '— The Mix Lab, presented by GlobalLYNK, AmpSpot & NFNTE Capital',
    ].join('\n');

    const confirmHtml = emailShell(`
      <h2 style="margin:0 0 12px">Application received</h2>
      <p>Hi ${esc(data.contact_name.split(' ')[0])}, thank you for your interest in joining The Mix Lab as a Community Partner.</p>
      <table style="border-collapse:collapse;margin:16px 0;font-size:15px">
        <tr><td style="padding:4px 14px 4px 0;color:#555">Business</td><td><b>${esc(data.business_name)}</b></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#555">Category</td><td><b>${esc(catLabel)}</b></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#555">Package</td><td><b>${esc(pkg.label)} — ${money(pkg.price)}</b></td></tr>
        <tr><td style="padding:4px 14px 4px 0;color:#555">Reference</td><td><b>${esc(row.ref)}</b></td></tr>
      </table>
      ${waitNote ? `<p><b>${esc(waitNote)}</b></p>` : ''}
      <p>Our team will review your application and contact you with next steps. <b>No payment is due at this stage.</b></p>
      <p>Submitting an application does not reserve a placement. Your placement is secured only after approval and payment.</p>
      <p>Questions? Reply to this email or contact <a href="mailto:${esc(TEAM_EMAIL)}">${esc(TEAM_EMAIL)}</a>.</p>`);

    const adminLink = `${SITE_URL}/admin/partners?ref=${encodeURIComponent(row.ref)}`;
    const teamText = [
      `New Community Partner application — ${row.ref}${isFull ? ' (WAITLIST: spot full)' : ''}`,
      '',
      `Business: ${data.business_name}`,
      `Contact: ${data.contact_name} <${data.email}>${data.phone ? ` · ${data.phone}` : ''}`,
      `Website/social: ${data.website}${data.instagram ? ` · IG ${data.instagram}` : ''}`,
      `Location: ${data.location}`,
      `Category: ${catLabel}`,
      `Package: ${pkg.label} — ${money(pkg.price)}`,
      `Flexible on category/package: ${data.flexible || '—'}`,
      `Attendee offer: ${data.offer_choice || '—'}${data.offer_description ? ` — ${data.offer_description}` : ''}`,
      '',
      `About: ${data.description}`,
      '',
      `Connection: ${data.connection}`,
      ...(data.notes ? ['', `Notes: ${data.notes}`] : []),
      '',
      `Review it (admin login required): ${adminLink}`,
    ].join('\n');

    const teamHtml = emailShell(`
      <h2 style="margin:0 0 8px">New Community Partner application</h2>
      <p style="margin:0 0 12px"><b>${esc(row.ref)}</b>${isFull ? ' — <b style="color:#b00">WAITLIST: spot is full</b>' : ''}</p>
      <p><b>${esc(data.business_name)}</b><br>${esc(data.contact_name)} &lt;${esc(data.email)}&gt;${data.phone ? ` · ${esc(data.phone)}` : ''}<br>
      ${esc(data.website)}${data.instagram ? ` · IG ${esc(data.instagram)}` : ''}<br>${esc(data.location)}</p>
      <p><b>${esc(catLabel)}</b> · <b>${esc(pkg.label)} ${money(pkg.price)}</b><br>
      Flexible: ${esc(data.flexible || '—')} · Attendee offer: ${esc(data.offer_choice || '—')}${data.offer_description ? ` — ${esc(data.offer_description)}` : ''}</p>
      <p><b>About</b><br>${esc(data.description)}</p>
      <p><b>Connection</b><br>${esc(data.connection)}</p>
      ${data.notes ? `<p><b>Notes</b><br>${esc(data.notes)}</p>` : ''}
      <p style="margin:22px 0"><a href="${esc(adminLink)}" style="background:#2B3FD6;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Review application</a></p>
      <p style="font-size:12px;color:#666">Admin login required. Applicant details are private.</p>`);

    const [toApplicant, toTeam] = await Promise.all([
      sendEmail({ to: data.email, replyTo: TEAM_EMAIL, subject: `We received your Community Partner application (${row.ref})`, text: confirmText, html: confirmHtml }),
      sendEmail({ to: TEAM_EMAIL, replyTo: data.email, subject: `New Mix Lab partner application: ${data.business_name} (${row.ref})`, text: teamText, html: teamHtml }),
    ]);

    await db.from('mixlab_partner_applications').update({
      confirmation_sent_at: toApplicant.ok ? new Date().toISOString() : null,
      team_notified_at: toTeam.ok ? new Date().toISOString() : null,
    }).eq('id', row.id);

    return res.status(200).json({ ok: true, ref: row.ref, status: row.status, emailed: toApplicant.ok });
  } catch (err) {
    console.error('partner-apply error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again, or email ' + TEAM_EMAIL + '.' });
  }
}