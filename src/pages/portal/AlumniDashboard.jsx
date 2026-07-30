import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { color, eyebrow, h1, h2, body, buttonPrimary, buttonGhost, container, space, font } from '../../styles/tokens';

export default function AlumniDashboard() {
  const { profile, signOut } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [djProfile, setDjProfile] = useState(null);
  const [form, setForm] = useState({ mix_url: '', instagram: '', genres: '', is_published: false });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGigs();
    loadDjProfile();
  }, []);

  async function loadGigs() {
    const { data } = await supabase
      .from('gig_requests')
      .select('*, gig_claims(dj_id)')
      .order('created_at', { ascending: false });
    setGigs(data || []);
  }

  async function loadDjProfile() {
    const { data } = await supabase.from('dj_profiles').select('*').eq('id', profile.id).single();
    if (data) {
      setDjProfile(data);
      setForm({
        mix_url: data.mix_url || '',
        instagram: data.instagram || '',
        genres: (data.genres || []).join(', '),
        is_published: data.is_published,
      });
    }
  }

  async function claimGig(gigId) {
    const { error } = await supabase.from('gig_claims').insert({ gig_id: gigId, dj_id: profile.id });
    if (!error) {
      await supabase.from('gig_requests').update({ status: 'claimed' }).eq('id', gigId);
      loadGigs();
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    const slug = (profile.full_name || profile.email).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = {
      id: profile.id,
      slug,
      mix_url: form.mix_url,
      instagram: form.instagram,
      genres: form.genres.split(',').map((g) => g.trim()).filter(Boolean),
      is_published: form.is_published,
    };
    const { error } = await supabase.from('dj_profiles').upsert(payload);
    setSaving(false);
    if (error) return setMessage('Error: ' + error.message);
    setMessage('Saved.');
    loadDjProfile();
  }

  return (
    <div style={{ padding: `${space.xxl} 0 ${space.xxxl}` }}>
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Alumni Portal</span></div>
            <h1 style={{ ...h1, fontSize: '36px' }}>Gigs &amp; your profile.</h1>
          </div>
          <button onClick={signOut} style={signOutStyle}>Sign out</button>
        </div>

        <h2 style={{ ...h2, fontSize: '22px', marginTop: space.xl, marginBottom: space.md }}>Open gigs</h2>
        {gigs.filter((g) => g.status === 'open').length === 0 ? (
          <p style={body}>No open gigs right now — check back soon.</p>
        ) : (
          gigs.filter((g) => g.status === 'open').map((g) => (
            <div key={g.id} style={{ border: `1px solid ${color.line}`, padding: space.md, marginBottom: space.sm, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: space.sm }}>
              <div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', color: color.white, marginBottom: '4px' }}>
                  {g.event_date || 'Date TBD'} {g.event_time && `· ${g.event_time}`}
                </h3>
                <p style={{ ...body, fontSize: '14px' }}>{g.details}</p>
                {g.budget && <p style={{ ...body, fontSize: '13px' }}>Budget: {g.budget}</p>}
              </div>
              <button onClick={() => claimGig(g.id)} style={buttonPrimary}>Claim gig</button>
            </div>
          ))
        )}

        <h2 style={{ ...h2, fontSize: '22px', marginTop: space.xxl, marginBottom: space.md }}>
          Your public DJ profile {djProfile?.is_published ? '· Live' : '· Not published'}
        </h2>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, maxWidth: '480px' }}>
          <input
            type="url"
            placeholder="Mix link (SoundCloud, Mixcloud, etc.)"
            value={form.mix_url}
            onChange={(e) => setForm({ ...form, mix_url: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Instagram handle"
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Genres, comma separated (Afrobeats, Amapiano)"
            value={form.genres}
            onChange={(e) => setForm({ ...form, genres: e.target.value })}
            style={inputStyle}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: font.body, fontSize: '14px', color: color.muted }}>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Publish my profile (clients can find and book me)
          </label>
          <button type="submit" disabled={saving} style={{ ...buttonGhost, justifyContent: 'center' }}>
            {saving ? 'Saving…' : 'Save profile'}
          </button>
          {message && <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const signOutStyle = {
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.05em',
  color: color.mutedDim,
  background: 'none',
  border: `1px solid ${color.line}`,
  padding: '10px 16px',
  cursor: 'pointer',
};

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: '4px',
  padding: '14px 16px',
  outline: 'none',
};