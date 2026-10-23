import { adminClient, getSettings, votingState } from './_ce.js';
import { CONTESTANTS } from '../src/data/contestants.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token = String((req.body || {}).token || '');
    if (!/^[a-f0-9]{48}$/.test(token)) return res.status(400).json({ error: 'Invalid link.' });

    const db = adminClient();
    const { data: voter } = await db
      .from('ce_voters').select('id, name, confirmed_at').eq('token', token).maybeSingle();
    if (!voter) return res.status(404).json({ error: 'This confirmation link is not valid.' });

    if (!voter.confirmed_at) {
      const state = votingState(await getSettings(db));
      if (state === 'closed') return res.status(403).json({ error: 'Voting has closed.' });
      await db.from('ce_voters').update({ confirmed_at: new Date().toISOString() }).eq('id', voter.id);
    }

    const { data: votes } = await db.from('ce_votes').select('category, contestant_slug').eq('voter_id', voter.id);
    const picks = (votes || []).map((v) => {
      const c = CONTESTANTS.find((x) => x.slug === v.contestant_slug);
      return { category: v.category, slug: v.contestant_slug, name: c ? c.name : v.contestant_slug };
    });

    return res.status(200).json({ status: 'confirmed', name: voter.name, picks });
  } catch (err) {
    console.error('vote-confirm error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}