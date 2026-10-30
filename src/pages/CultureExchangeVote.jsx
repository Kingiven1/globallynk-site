import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { CONTESTANTS } from '../data/contestants';
import {
  color, eyebrow, h1, h2, body, bodyLg, card, radius,
  buttonPrimary, buttonGhost, container, section, space, font,
} from '../styles/tokens';

const CATEGORIES = [
  { key: 'woman', label: 'Women', singular: 'woman' },
  { key: 'man', label: 'Men', singular: 'man' },
];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    });
  } catch {
    return '';
  }
}

const field = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: radius.md,
  border: `1px solid ${color.line}`,
  background: '#fff',
  color: '#17170F',
  fontSize: '15px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

export default function CultureExchangeVote() {
  const [params, setParams] = useSearchParams();
  const confirmToken = params.get('confirm');
  const refSlug = params.get('dj');

  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState('woman');
  const [picks, setPicks] = useState({ woman: null, man: null });
  const [playing, setPlaying] = useState(null); // contestant being watched
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', optIn: false, website: '' });
  const [confirmState, setConfirmState] = useState(null); // null | {loading} | {ok, picks, name} | {error}

  // Random order each visit so nobody is always first
  const order = useMemo(() => {
    const out = {};
    CATEGORIES.forEach((c) => {
      out[c.key] = shuffle(CONTESTANTS.filter((x) => x.category === c.key));
    });
    return out;
  }, []);

  // Remember who sent this person (for the admin "who drives votes" stats)
  useEffect(() => {
    if (refSlug && CONTESTANTS.some((c) => c.slug === refSlug)) {
      try { localStorage.setItem('tt_ref', refSlug); } catch { /* ignore */ }
      const c = CONTESTANTS.find((x) => x.slug === refSlug);
      setTab(c.category);
    }
  }, [refSlug]);

  useEffect(() => {
    supabase.from('ce_settings').select('opens_at, closes_at').eq('id', 1).maybeSingle()
      .then(({ data }) => setSettings(data || {}))
      .catch(() => setSettings({}));
  }, []);

  // Email confirmation landing
  useEffect(() => {
    if (!confirmToken) return;
    setConfirmState({ loading: true });
    fetch('/api/vote-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: confirmToken }),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => setConfirmState(ok ? { ok: true, picks: d.picks, name: d.name } : { error: d.error }))
      .catch(() => setConfirmState({ error: 'Could not confirm. Please try the link again.' }))
      .finally(() => {
        const next = new URLSearchParams(params);
        next.delete('confirm');
        setParams(next, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmToken]);

  // Esc closes video / form
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setPlaying(null); setFormOpen(false); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const now = new Date();
  const notOpen = settings?.opens_at && now < new Date(settings.opens_at);
  const closed = settings?.closes_at && now > new Date(settings.closes_at);
  const votingOpen = settings && !notOpen && !closed;

  const pickCount = (picks.woman ? 1 : 0) + (picks.man ? 1 : 0);
  const nameOf = (slug) => CONTESTANTS.find((c) => c.slug === slug)?.name;

  function choose(c) {
    if (!votingOpen) return;
    setPicks((p) => ({ ...p, [c.category]: p[c.category] === c.slug ? null : c.slug }));
  }

  function shareLink(c) {
    return `${window.location.origin}/culture-exchange/vote?dj=${c.slug}`;
  }

  async function share(c) {
    const url = shareLink(c);
    const text = `Vote for ${c.name} in Tables Turned by GlobalLYNK`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tables Turned', text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch { /* user cancelled */ }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setStatus('sending');
    let ref = null;
    try { ref = localStorage.getItem('tt_ref'); } catch { /* ignore */ }
    try {
      const r = await fetch('/api/vote-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, picks, ref }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || 'Something went wrong.');
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setStatus('idle');
    }
  }

  const list = order[tab];
  const withVideo = (c) => !!(c.videoId || c.videoUrl);

  return (
    <div style={{ paddingBottom: pickCount && votingOpen ? '110px' : 0 }}>
      {/* HERO */}
      <section style={{ ...section, paddingBottom: space.md }}>
        <div style={container}>
          <div style={eyebrow}><span>Tables Turned · Round 2 · Public vote</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(34px, 5.5vw, 60px)', maxWidth: '780px' }}>
            Your vote picks the final 10.
          </h1>
          <p style={{ ...bodyLg, marginTop: space.md, maxWidth: '640px' }}>
            Watch each DJ's one-minute set, then vote for your favorite woman and your favorite man.
            The top 5 in each group, with judges' scores factored in, move on to the live finals in Charlotte.
          </p>

          {settings && notOpen && (
            <Notice>Voting is paused and opens {formatDate(settings.opens_at)}. You can watch the sets now. If you already voted, those votes will not count, and you can vote again when polls open.</Notice>
          )}
          {settings && closed && <Notice>Voting is closed. Thank you for watching and voting!</Notice>}
          {votingOpen && settings?.closes_at && (
            <Notice tone="info">Voting closes {formatDate(settings.closes_at)}.</Notice>
          )}

          {confirmState?.loading && <Notice tone="info">Confirming your vote…</Notice>}
          {confirmState?.error && <Notice tone="error">{confirmState.error}</Notice>}
          {confirmState?.ok && (
            <Notice tone="success">
              <strong>Your vote is confirmed{confirmState.name ? `, ${confirmState.name.split(' ')[0]}` : ''}!</strong>{' '}
              {confirmState.picks?.map((p) => `${p.category === 'woman' ? 'Women' : 'Men'}: ${p.name}`).join(' · ')}
              <div style={{ marginTop: '8px' }}>
                Help your pick win — share their link:
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {confirmState.picks?.map((p) => {
                    const c = CONTESTANTS.find((x) => x.slug === p.slug);
                    return c ? (
                      <button key={p.slug} type="button" onClick={() => share(c)} style={{ ...buttonGhost, cursor: 'pointer' }}>
                        Share {c.name}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            </Notice>
          )}
        </div>
      </section>

      {/* TABS */}
      <section style={{ ...section, paddingTop: space.md }}>
        <div style={container}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: space.lg, flexWrap: 'wrap' }}>
            {CATEGORIES.map((c) => {
              const active = tab === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setTab(c.key)}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '999px',
                    border: `1px solid ${active ? color.cyan : color.line}`,
                    background: active ? color.cyan : 'transparent',
                    color: active ? '#fff' : color.white,
                    fontFamily: font.mono,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  {c.label} ({CONTESTANTS.filter((x) => x.category === c.key).length})
                  {picks[c.key] ? ' ✓' : ''}
                </button>
              );
            })}
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: space.lg }}
          >
            {list.map((c) => {
              const selected = picks[c.category] === c.slug;
              return (
                <div
                  key={c.slug}
                  style={{
                    ...card,
                    padding: 0,
                    overflow: 'hidden',
                    border: `2px solid ${selected ? color.cyan : (refSlug === c.slug ? color.cyanDim : color.line)}`,
                    boxShadow: selected ? `0 0 0 3px ${color.cyan}33` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => (withVideo(c) ? setPlaying(c) : null)}
                    aria-label={withVideo(c) ? `Watch ${c.name}` : c.name}
                    style={{
                      position: 'relative', padding: 0, border: 'none', background: '#111',
                      cursor: withVideo(c) ? 'pointer' : 'default', display: 'block', width: '100%',
                    }}
                  >
                    <img
                      src={c.photo}
                      alt={c.name}
                      loading="lazy"
                      style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', objectPosition: 'center 25%', display: 'block' }}
                    />
                    {withVideo(c) ? (
                      <span
                        style={{
                          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0) 55%)',
                        }}
                      >
                        <span
                          style={{
                            width: '58px', height: '58px', borderRadius: '50%', background: 'rgba(255,255,255,0.92)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#17170F',
                            paddingLeft: '4px',
                          }}
                        >
                          ▶
                        </span>
                      </span>
                    ) : (
                      <span
                        style={{
                          position: 'absolute', left: '10px', bottom: '10px', padding: '5px 10px', borderRadius: '999px',
                          background: 'rgba(0,0,0,0.7)', color: '#fff', fontFamily: font.mono, fontSize: '11px',
                        }}
                      >
                        Set coming soon
                      </span>
                    )}
                  </button>

                  <div style={{ padding: space.md, display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', color: color.white, margin: 0 }}>
                      {c.name}
                    </h3>
                    <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim }}>{c.city}</div>
                    {c.genres && <div style={{ ...body, fontSize: '13px' }}>{c.genres}</div>}

                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: space.sm, flexWrap: 'wrap' }}>
                      {withVideo(c) && (
                        <button type="button" onClick={() => setPlaying(c)} style={{ ...buttonGhost, cursor: 'pointer', flex: 1, justifyContent: 'center' }}>
                          Watch set
                        </button>
                      )}
                      {votingOpen && (
                        <button
                          type="button"
                          onClick={() => choose(c)}
                          style={{
                            ...(selected ? buttonGhost : buttonPrimary),
                            cursor: 'pointer', flex: 1, justifyContent: 'center',
                          }}
                        >
                          {selected ? '✓ Your pick' : 'Vote'}
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '12px', fontFamily: font.mono, marginTop: '4px' }}>
                      {c.instagram && (
                        <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" style={{ color: color.cyan, textDecoration: 'none' }}>
                          @{c.instagram}
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => share(c)}
                        style={{ background: 'none', border: 'none', padding: 0, color: color.cyan, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ ...body, fontSize: '13px', marginTop: space.xl, maxWidth: '640px' }}>
            One vote per category per person, and every vote is confirmed by email. Suspicious or duplicate votes are removed.
            Final spots are decided by public votes combined with the judges' scores.{' '}
            <Link to="/culture-exchange" style={{ color: color.cyan, textDecoration: 'none' }}>About Tables Turned →</Link>
          </p>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {playing && (
        <Overlay onClose={() => setPlaying(null)}>
          <div style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px' }}>{playing.name}</div>
            <div style={{ fontFamily: font.mono, fontSize: '12px', opacity: 0.75 }}>{playing.city}</div>
          </div>
          <div
            style={
              playing.vertical
                ? { height: 'min(68vh, 620px)', aspectRatio: '9/16', maxWidth: '92vw', margin: '0 auto' }
                : { width: 'min(92vw, 760px)', aspectRatio: '16/9', margin: '0 auto' }
            }
          >
            {playing.videoUrl ? (
              <video
                key={playing.videoUrl}
                src={playing.videoUrl}
                controls
                autoPlay
                playsInline
                style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#000', objectFit: 'contain' }}
              />
            ) : (
              <iframe
                title={`${playing.name} set`}
                src={`https://www.youtube.com/embed/${playing.videoId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0, borderRadius: '12px', background: '#000' }}
              />
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
            {votingOpen && (
              <button
                type="button"
                onClick={() => { choose(playing); setPlaying(null); }}
                style={{ ...buttonPrimary, cursor: 'pointer' }}
              >
                {picks[playing.category] === playing.slug ? '✓ Your pick' : `Vote for ${playing.name}`}
              </button>
            )}
            <button type="button" onClick={() => setPlaying(null)} style={{ ...buttonGhost, cursor: 'pointer', background: '#fff' }}>
              Close
            </button>
          </div>
        </Overlay>
      )}

      {/* BALLOT BAR */}
      {votingOpen && pickCount > 0 && !formOpen && (
        <div
          style={{
            position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 40,
            background: color.bg, borderTop: `1px solid ${color.line}`,
            boxShadow: '0 -8px 30px rgba(0,0,0,0.12)', padding: '14px 16px',
          }}
        >
          <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '14px', color: color.white }}>
              <div><strong>Women:</strong> {picks.woman ? nameOf(picks.woman) : <span style={{ opacity: 0.55 }}>no pick yet</span>}</div>
              <div><strong>Men:</strong> {picks.man ? nameOf(picks.man) : <span style={{ opacity: 0.55 }}>no pick yet</span>}</div>
            </div>
            <button type="button" onClick={() => { setFormOpen(true); setStatus('idle'); setError(''); }} style={{ ...buttonPrimary, cursor: 'pointer' }}>
              Submit my vote →
            </button>
          </div>
        </div>
      )}

      {/* SUBMIT FORM */}
      {formOpen && (
        <Overlay onClose={() => setFormOpen(false)} light>
          {status === 'sent' ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ ...h2, fontSize: '28px', marginBottom: '10px' }}>Check your email</h2>
              <p style={body}>
                We sent a confirmation link to <strong>{form.email}</strong>. Your vote counts once you tap it.
                If you don't see it, check spam or promotions.
              </p>
              <button type="button" onClick={() => setFormOpen(false)} style={{ ...buttonGhost, cursor: 'pointer', marginTop: space.md }}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 style={{ ...h2, fontSize: '26px', marginBottom: '6px' }}>Almost done</h2>
              <p style={{ ...body, marginBottom: space.md }}>
                {picks.woman && <>Women: <strong>{nameOf(picks.woman)}</strong>. </>}
                {picks.man && <>Men: <strong>{nameOf(picks.man)}</strong>.</>}
                {' '}Enter your details and we'll email you a link to confirm.
              </p>

              <div style={{ display: 'grid', gap: '10px' }}>
                <input style={field} placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                <input style={field} type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                <input style={field} type="tel" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                {/* Honeypot — hidden from real people */}
                <input
                  tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                  name="website"
                />
                <label style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: '#17170F', lineHeight: 1.4 }}>
                  <input type="checkbox" checked={form.optIn} onChange={(e) => setForm({ ...form, optIn: e.target.checked })} style={{ marginTop: '3px' }} />
                  Keep me posted on the finals, workshops and events from GlobalLYNK.
                </label>
                <p style={{ fontSize: '12px', color: '#5A5A4A', lineHeight: 1.4, margin: '4px 0 0' }}>
                  We use your details only to confirm your vote and keep the competition fair. See our{' '}
                  <Link to="/privacy" target="_blank" style={{ color: '#17170F', textDecoration: 'underline' }}>privacy policy</Link>.
                </p>
              </div>

              {error && <p style={{ color: '#B3261E', fontSize: '14px', marginTop: '10px' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '10px', marginTop: space.md, flexWrap: 'wrap' }}>
                <button type="submit" disabled={status === 'sending'} style={{ ...buttonPrimary, cursor: 'pointer', opacity: status === 'sending' ? 0.7 : 1 }}>
                  {status === 'sending' ? 'Sending…' : 'Send confirmation email'}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} style={{ ...buttonGhost, cursor: 'pointer' }}>
                  Back
                </button>
              </div>
            </form>
          )}
        </Overlay>
      )}
    </div>
  );
}

function Notice({ children, tone = 'info' }) {
  const tones = {
    info: { bg: '#E8EEFF', border: '#2E4BE0' },
    success: { bg: '#E6F6EA', border: '#2E9E4F' },
    error: { bg: '#FDECEA', border: '#B3261E' },
  };
  const t = tones[tone] || tones.info;
  return (
    <div
      style={{
        marginTop: space.md, padding: '14px 16px', borderRadius: radius.md, maxWidth: '680px',
        background: t.bg, border: `1px solid ${t.border}`, color: '#17170F', fontSize: '15px', lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

function Overlay({ children, onClose, light = false }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(10,10,10,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={
          light
            ? { background: color.bg, borderRadius: radius.lg, padding: space.lg, width: 'min(94vw, 460px)', maxHeight: '92vh', overflowY: 'auto', position: 'relative' }
            : { width: '100%', position: 'relative' }
        }
      >
        {children}
      </div>
    </div>
  );
}