import { Resend } from 'resend';
import crypto from 'crypto';
import { adminClient, getSettings, votingState, emailKey, clientIp, hashIp, SITE_URL } from './_ce.js';
import { CONTESTANTS } from '../src/data/contestants.js';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};

    // Honeypot: real people leave this empty.
    if (body.website) return res.status(200).json({ status: 'check_email' });

    const name = String(body.name || '').trim().slice(0, 80);
    const email = String(body.email || '').trim().slice(0, 160);
    const phone = String(body.phone || '').trim().slice(0, 30) || null;
    const optIn = !!body.optIn;
    const picks = body.picks || {};

    if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });

    // Validate picks against the real contestant list
    const rows = [];
    for (const category of ['woman', 'man']) {
      const slug = picks[category];
      if (!slug) continue;
      const c = CONTESTANTS.find((x) => x.slug === slug && x.category === category);
      if (!c) return res.status(400).json({ error: 'One of your picks is not valid.' });
      rows.push({ category, contestant_slug: slug });
    }
    if (!rows.length) return res.status(400).json({ error: 'Pick at least one DJ to vote for.' });

    const db = adminClient();

    const state = votingState(await getSettings(db));
    if (state === 'not_open') return res.status(403).json({ error: 'Voting has not opened yet.' });
    if (state === 'closed') return res.status(403).json({ error: 'Voting is closed.' });

    const ipHash = hashIp(clientIp(req));
    const key = emailKey(email);

    // Simple abuse limit: no more than 8 new voters per IP per hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await db
      .from('ce_voters').select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash).gte('created_at', hourAgo);
    if ((count || 0) >= 8) {
      return res.status(429).json({ error: 'Too many votes from this connection. Try again later.' });
    }

    const ref = CONTESTANTS.some((c) => c.slug === body.ref) ? body.ref : null;
    const token = crypto.randomBytes(24).toString('hex');

    const { data: existing } = await db
      .from('ce_voters').select('id, confirmed_at, email_sent_at').eq('email_key', key).maybeSingle();

    let voterId;
    if (existing) {
      if (existing.confirmed_at) {
        return res.status(409).json({ error: 'This email has already voted. Thank you!' });
      }
      if (existing.email_sent_at && Date.now() - new Date(existing.email_sent_at).getTime() < 60 * 1000) {
        return res.status(429).json({ error: 'We just sent you an email. Check your inbox (and spam), or try again in a minute.' });
      }
      await db.from('ce_voters').update({
        name, email, phone, opt_in: optIn, token, ip_hash: ipHash,
        user_agent: String(req.headers['user-agent'] || '').slice(0, 200), ref,
      }).eq('id', existing.id);
      await db.from('ce_votes').delete().eq('voter_id', existing.id);
      voterId = existing.id;
    } else {
      const { data: created, error } = await db.from('ce_voters').insert({
        name, email, email_key: key, phone, opt_in: optIn, token, ip_hash: ipHash,
        user_agent: String(req.headers['user-agent'] || '').slice(0, 200), ref,
      }).select('id').single();
      if (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'This email has already voted.' });
        throw error;
      }
      voterId = created.id;
    }

    const { error: voteErr } = await db.from('ce_votes').insert(
      rows.map((r) => ({ ...r, voter_id: voterId }))
    );
    if (voteErr) throw voteErr;

    const names = rows.map((r) => {
      const c = CONTESTANTS.find((x) => x.slug === r.contestant_slug);
      return `${r.category === 'woman' ? 'Women' : 'Men'}: ${c.name}`;
    });
    const link = `${SITE_URL}/culture-exchange/vote?confirm=${token}`;

    await resend.emails.send({
      from: 'GlobalLYNK <noreply@globallynk.club>',
      to: email,
      subject: 'Confirm your vote — Tables Turned',
      text: [
        `Hey ${name.split(' ')[0]},`,
        '',
        'One more step. Confirm your vote for Tables Turned:',
        '',
        ...names.map((n) => `  • ${n}`),
        '',
        `Confirm here: ${link}`,
        '',
        'Your vote only counts once you confirm. If you did not do this, ignore this email.',
        '',
        '— GlobalLYNK',
      ].join('\n'),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#17170F">
          <h2 style="margin:0 0 12px">Confirm your vote</h2>
          <p>Hey ${name.split(' ')[0].replace(/[<>&]/g, '')}, one more step for <b>Tables Turned</b>:</p>
          <ul>${names.map((n) => `<li>${n.replace(/[<>&]/g, '')}</li>`).join('')}</ul>
          <p style="margin:24px 0">
            <a href="${link}" style="background:#2E4BE0;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:bold">Confirm my vote</a>
          </p>
          <p style="font-size:13px;color:#555">Your vote only counts once you confirm. If you didn't do this, you can ignore this email.</p>
          <p style="font-size:13px;color:#555">— GlobalLYNK</p>
        </div>`,
    });

    await db.from('ce_voters').update({ email_sent_at: new Date().toISOString() }).eq('id', voterId);

    return res.status(200).json({ status: 'check_email' });
  } catch (err) {
    console.error('vote-submit error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}