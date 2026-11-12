import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { CONTESTANTS } from '../data/contestants';
import { color, eyebrow, h1, h2, body, card, radius, container, section, space, font } from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// Judge scoring for Tables Turned. Each judge logs in and scores every DJ 1–10.
// Their scores are private, averaged across judges, and feed the judges' share of
// the final result on the admin Votes page.
//
// WHO SHOWS UP: leave FINALIST_SLUGS as null to score everyone. To score only the
// finalists, list their slugs (from src/data/contestants.js), e.g.
//   const FINALIST_SLUGS = ['anansi', 'bee-candy', ...];
// ──────────────────────────────────────────────────────────────────────────
const FINALIST_SLUGS = null;

const CATEGORIES = [
  { key: 'woman', label: 'Women' },
  { key: 'man', label: 'Men' },
];

function watchUrl(c) {
  if (!c.videoId) return null;
  return c.vertical ? `https://www.youtube.com/shorts/${c.videoId}` : `https://www.youtube.com/watch?v=${c.videoId}`;
}

export default function JudgeScoring() {
  const { session, profile } = useAuth();
  const allowed = profile?.role === 'judge' || profile?.role === 'admin';
  const uid = session?.user?.id;

  const [scores, setScores] = useState({}); // slug -> string being typed
  const [saved, setSaved] = useState({}); // slug -> 'saving' | 'saved' | 'error'
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const contestants = useMemo(
    () => CONTESTANTS.filter((c) => !FINALIST_SLUGS || FINALIST_SLUGS.includes(c.slug)),
    []
  );

  useEffect(() => {
    if (!allowed || !uid) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('ce_judge_entries')
        .select('contestant_slug, score')
        .eq('judge_id', uid);
      if (error) setMsg('Could not load your saved scores: ' + error.message);
      const map = {};
      const flags = {};
      (data || []).forEach((r) => {
        map[r.contestant_slug] = String(r.score);
        flags[r.contestant_slug] = 'saved';
      });
      setScores(map);
      setSaved(flags);
      setLoading(false);
    })();
  }, [allowed, uid]);

  async function save(slug, value) {
    setMsg('');
    if (value === '') {
      // cleared the box: remove the score
      setSaved((p) => ({ ...p, [slug]: 'saving' }));
      const { error } = await supabase.from('ce_judge_entries').delete().eq('judge_id', uid).eq('contestant_slug', slug);
      setSaved((p) => ({ ...p, [slug]: error ? 'error' : undefined }));
      if (error) setMsg('Error: ' + error.message);
      return;
    }
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      setSaved((p) => ({ ...p, [slug]: 'error' }));
      return setMsg('Scores must be a whole number from 1 to 10.');
    }
    setSaved((p) => ({ ...p, [slug]: 'saving' }));
    const { error } = await supabase
      .from('ce_judge_entries')
      .upsert(
        { judge_id: uid, contestant_slug: slug, score: n, updated_at: new Date().toISOString() },
        { onConflict: 'judge_id,contestant_slug' }
      );
    setSaved((p) => ({ ...p, [slug]: error ? 'error' : 'saved' }));
    if (error) setMsg('Error saving: ' + error.message);
  }

  // Tap a number to score; tap the same number again to clear it.
  function pick(slug, n) {
    const next = String(scores[slug]) === String(n) ? '' : String(n);
    setScores((p) => ({ ...p, [slug]: next }));
    save(slug, next);
  }

  const scoredCount = contestants.filter((c) => saved[c.slug] === 'saved').length;

  if (!profile) {
    return <Wrap><p style={body}>Loading…</p></Wrap>;
  }
  if (!allowed) {
    return (
      <Wrap>
        <h1 style={{ ...h1, fontSize: '32px' }}>Judges only</h1>
        <p style={body}>Sign in with your judge account to score the DJs.</p>
      </Wrap>
    );
  }

  const input = {
    fontFamily: font.mono,
    fontSize: '16px',
    width: '84px',
    padding: '10px 12px',
    borderRadius: radius.sm,
    border: `1px solid ${color.line}`,
    background: color.bg,
    color: color.white,
  };

  return (
    <Wrap>
      <div style={eyebrow}><span>Tables Turned · Judges</span></div>
      <h1 style={{ ...h1, fontSize: 'clamp(30px, 5vw, 48px)' }}>Score the DJs.</h1>
      <p style={{ ...body, maxWidth: '620px', marginBottom: space.sm }}>
        Watch each set, then give every DJ a score from 1 to 10 (10 is the best). Tap a number and it saves
        instantly. Tap it again to clear it, or tap a different number to change it. Your scores are private
        and are combined with the other judges and the public vote.
      </p>
      <p style={{ fontFamily: font.mono, fontSize: '13px', color: color.cyan, marginBottom: space.lg }}>
        {scoredCount} of {contestants.length} scored
      </p>

      {msg && <div role="status" style={{ ...card, padding: space.sm, marginBottom: space.md, fontSize: '14px' }}>{msg}</div>}
      {loading && <p style={body}>Loading your scores…</p>}

      {!loading && CATEGORIES.map((cat) => (
        <div key={cat.key} style={{ marginBottom: space.xl }}>
          <h2 style={{ ...h2, fontSize: '24px', marginBottom: space.md }}>{cat.label}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
            {contestants.filter((c) => c.category === cat.key).map((c) => {
              const url = watchUrl(c);
              const state = saved[c.slug];
              return (
                <div
                  key={c.slug}
                  style={{ ...card, padding: space.md, display: 'flex', alignItems: 'center', gap: space.md, flexWrap: 'wrap' }}
                >
                  {c.photo && (
                    <img
                      src={c.photo}
                      alt=""
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: radius.md }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: color.white }}>{c.name}</div>
                    <div style={{ ...body, fontSize: '13px' }}>{c.city}{c.genres ? ` · ${c.genres}` : ''}</div>
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan, textDecoration: 'none' }}>
                        Watch the set ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <div role="group" aria-label={`Score for ${c.name}, 1 to 10`} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                        const on = String(scores[c.slug]) === String(n);
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => pick(c.slug, n)}
                            aria-pressed={on}
                            style={{
                              fontFamily: font.mono,
                              fontSize: '15px',
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              border: `1px solid ${on ? color.cyan : color.line}`,
                              background: on ? color.cyan : 'transparent',
                              color: on ? '#fff' : color.white,
                            }}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <span style={{ fontFamily: font.mono, fontSize: '12px', minWidth: '58px', color: state === 'error' ? '#C62828' : color.mutedDim }}>
                      {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : state === 'error' ? 'Not saved' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <section style={{ ...section, minHeight: '70vh' }}>
      <div style={{ ...container, maxWidth: '860px' }}>{children}</div>
    </section>
  );
}