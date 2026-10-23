import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { CONTESTANTS } from '../data/contestants';
import { color, eyebrow, h1, h2, body, card, radius, buttonPrimary, buttonGhost, container, space, font } from '../styles/tokens';

const CAT_LABEL = { woman: 'Women', man: 'Men' };
const TOP_N = 5;

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AdminVotes() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [summary, setSummary] = useState(null);
  const [settings, setSettings] = useState(null);
  const [judges, setJudges] = useState({}); // slug -> score string
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (isAdmin) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function load() {
    setLoading(true);
    const [s, st, j] = await Promise.all([
      supabase.rpc('ce_admin_summary'),
      supabase.from('ce_settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('ce_judge_scores').select('contestant_slug, score'),
    ]);
    if (s.error) setMsg('Error loading stats: ' + s.error.message);
    setSummary(s.data || null);
    setSettings(st.data || null);
    const map = {};
    (j.data || []).forEach((r) => { map[r.contestant_slug] = r.score == null ? '' : String(r.score); });
    setJudges(map);
    setLoading(false);
  }

  async function saveSettings(patch) {
    setMsg('');
    const { error } = await supabase.from('ce_settings').update(patch).eq('id', 1);
    if (error) return setMsg('Error: ' + error.message);
    setSettings((p) => ({ ...p, ...patch }));
    setMsg('Saved.');
  }

  async function saveJudge(slug, value) {
    setMsg('');
    const score = value === '' ? null : Math.max(0, Math.min(100, Number(value)));
    if (value !== '' && Number.isNaN(score)) return setMsg('Judge score must be a number from 0 to 100.');
    const { error } = await supabase.from('ce_judge_scores').upsert({ contestant_slug: slug, score, updated_at: new Date().toISOString() });
    if (error) return setMsg('Error: ' + error.message);
    setMsg('Saved.');
  }

  async function flagCluster(prefix, flag) {
    setMsg('');
    const { data, error } = await supabase.rpc('ce_set_flag_cluster', { p_prefix: prefix, p_flag: flag });
    if (error) return setMsg('Error: ' + error.message);
    setMsg(`${flag ? 'Flagged' : 'Unflagged'} ${data} voter(s).`);
    load();
  }

  async function exportVoters() {
    setExporting(true);
    const rows = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from('ce_voters')
        .select('name, email, phone, opt_in, confirmed_at, created_at, ref, flagged')
        .not('confirmed_at', 'is', null)
        .order('created_at', { ascending: true })
        .range(from, from + 999);
      if (error) { setMsg('Export error: ' + error.message); setExporting(false); return; }
      rows.push(...data);
      if (data.length < 1000) break;
    }
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = ['name', 'email', 'phone', 'opted_in_for_updates', 'confirmed_at', 'ref', 'flagged'];
    const csv = [header.join(',')]
      .concat(rows.map((r) => [r.name, r.email, r.phone, r.opt_in ? 'yes' : 'no', r.confirmed_at, r.ref || 'direct', r.flagged ? 'yes' : 'no'].map(esc).join(',')))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `tables-turned-voters-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  // Combine votes + judges into a ranked table per category
  const tables = useMemo(() => {
    const weight = settings?.judge_weight ?? 0.5;
    const votesBySlug = {};
    (summary?.by_contestant || []).forEach((r) => { votesBySlug[r.slug] = r; });
    const out = {};
    ['woman', 'man'].forEach((cat) => {
      const rows = CONTESTANTS.filter((c) => c.category === cat).map((c) => {
        const v = votesBySlug[c.slug] || { confirmed: 0, pending: 0, flagged: 0 };
        return { ...c, confirmed: v.confirmed, pending: v.pending, flagged: v.flagged };
      });
      const max = Math.max(1, ...rows.map((r) => r.confirmed));
      rows.forEach((r) => {
        r.votePct = (r.confirmed / max) * 100;
        const j = judges[r.slug];
        r.judge = j === '' || j == null ? null : Number(j);
        r.final = (1 - weight) * r.votePct + weight * (r.judge ?? 0);
      });
      rows.sort((a, b) => b.final - a.final);
      out[cat] = rows;
    });
    return out;
  }, [summary, judges, settings]);

  if (!profile) return <Page><p style={body}>Loading…</p></Page>;
  if (!isAdmin) return <Page><p style={body}>Admins only.</p></Page>;
  if (loading) return <Page><p style={body}>Loading stats…</p></Page>;

  const t = summary?.totals || {};
  const th = { textAlign: 'left', fontFamily: font.mono, fontSize: '11px', padding: '8px 10px', color: color.cyanDim, borderBottom: `1px solid ${color.line}` };
  const td = { padding: '10px', fontSize: '14px', borderBottom: `1px solid ${color.line}`, color: color.white };

  return (
    <Page>
      <div style={eyebrow}><span>Admin</span></div>
      <h1 style={{ ...h1, fontSize: '40px', marginBottom: space.md }}>Tables Turned — votes</h1>
      {msg && <p style={{ ...body, marginBottom: space.md }}>{msg}</p>}

      {/* Totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: space.md, marginBottom: space.lg }}>
        {[
          ['Confirmed voters', t.confirmed],
          ['Waiting on email', t.pending],
          ['Flagged', t.flagged],
          ['Opted in for updates', t.opt_in],
        ].map(([label, val]) => (
          <div key={label} style={{ ...card, padding: space.md }}>
            <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim }}>{label}</div>
            <div style={{ fontSize: '32px', fontFamily: 'Space Grotesk, sans-serif', color: color.white }}>{val ?? 0}</div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{ ...card, padding: space.lg, marginBottom: space.lg }}>
        <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.sm }}>Voting window and scoring</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: space.md }}>
          <label style={{ fontSize: '13px', color: color.white }}>
            Opens
            <input type="datetime-local" defaultValue={toLocalInput(settings?.opens_at)}
              onBlur={(e) => saveSettings({ opens_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              style={inputStyle} />
          </label>
          <label style={{ fontSize: '13px', color: color.white }}>
            Closes (blank = no end)
            <input type="datetime-local" defaultValue={toLocalInput(settings?.closes_at)}
              onBlur={(e) => saveSettings({ closes_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
              style={inputStyle} />
          </label>
          <label style={{ fontSize: '13px', color: color.white }}>
            Judges' share of final score (%)
            <input type="number" min="0" max="100" defaultValue={Math.round((settings?.judge_weight ?? 0.5) * 100)}
              onBlur={(e) => saveSettings({ judge_weight: Math.max(0, Math.min(100, Number(e.target.value))) / 100 })}
              style={inputStyle} />
          </label>
        </div>
        <p style={{ ...body, fontSize: '12px', marginTop: space.sm }}>
          Times are in your browser's time zone. Changes save when you click out of a box.
          Final score = (public votes as % of the category leader) and the judge score, mixed by the share above.
        </p>
      </div>

      {/* Rankings */}
      {['woman', 'man'].map((cat) => (
        <div key={cat} style={{ ...card, padding: space.lg, marginBottom: space.lg, overflowX: 'auto' }}>
          <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.sm }}>{CAT_LABEL[cat]} — top {TOP_N} advance</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead>
              <tr>
                <th style={th}>#</th><th style={th}>DJ</th><th style={th}>Confirmed votes</th>
                <th style={th}>Waiting on email</th><th style={th}>Vote %</th><th style={th}>Judge score (0-100)</th><th style={th}>Final</th>
              </tr>
            </thead>
            <tbody>
              {tables[cat].map((r, i) => (
                <tr key={r.slug} style={{ background: i < TOP_N ? 'rgba(46,75,224,0.07)' : 'transparent' }}>
                  <td style={td}>{i + 1}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.name}{!r.videoId ? ' (no video)' : ''}</td>
                  <td style={td}>{r.confirmed}</td>
                  <td style={td}>{r.pending}</td>
                  <td style={td}>{r.votePct.toFixed(0)}%</td>
                  <td style={td}>
                    <input type="number" min="0" max="100" value={judges[r.slug] ?? ''}
                      onChange={(e) => setJudges((p) => ({ ...p, [r.slug]: e.target.value }))}
                      onBlur={(e) => saveJudge(r.slug, e.target.value)}
                      style={{ ...inputStyle, width: '90px', marginTop: 0 }} />
                  </td>
                  <td style={{ ...td, fontWeight: 600 }}>{r.final.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* By day / by ref */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: space.lg, marginBottom: space.lg }}>
        <div style={{ ...card, padding: space.lg }}>
          <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.sm }}>Confirmed voters per day</h2>
          {(summary?.by_day || []).length === 0 && <p style={body}>No confirmed votes yet.</p>}
          {(summary?.by_day || []).map((d) => (
            <div key={d.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: color.white }}>
              <span>{d.day}</span><strong>{d.voters}</strong>
            </div>
          ))}
        </div>
        <div style={{ ...card, padding: space.lg }}>
          <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.sm }}>Where votes came from</h2>
          {(summary?.by_ref || []).length === 0 && <p style={body}>No confirmed votes yet.</p>}
          {(summary?.by_ref || []).map((r) => {
            const c = CONTESTANTS.find((x) => x.slug === r.ref);
            return (
              <div key={r.ref} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px', color: color.white }}>
                <span>{r.ref === 'direct' ? 'Direct / no DJ link' : `${c?.name || r.ref}'s link`}</span><strong>{r.voters}</strong>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suspicious clusters */}
      <div style={{ ...card, padding: space.lg, marginBottom: space.lg }}>
        <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.sm }}>Possible duplicate voting</h2>
        <p style={{ ...body, fontSize: '13px', marginBottom: space.sm }}>
          Connections with 4 or more voters. A household or a venue can be legit, so check before flagging. Flagged votes don't count.
        </p>
        {(summary?.ip_clusters || []).length === 0 && <p style={body}>Nothing suspicious so far.</p>}
        {(summary?.ip_clusters || []).map((c) => (
          <div key={c.prefix} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${color.line}`, color: color.white, fontSize: '14px' }}>
            <span style={{ fontFamily: font.mono }}>{c.prefix} — {c.voters} voters{c.flagged ? ` (${c.flagged} flagged)` : ''}</span>
            <span style={{ display: 'flex', gap: '8px' }}>
              <button type="button" style={{ ...buttonGhost, cursor: 'pointer' }} onClick={() => flagCluster(c.prefix, true)}>Flag all</button>
              {c.flagged > 0 && <button type="button" style={{ ...buttonGhost, cursor: 'pointer' }} onClick={() => flagCluster(c.prefix, false)}>Unflag</button>}
            </span>
          </div>
        ))}
      </div>

      <button type="button" onClick={exportVoters} disabled={exporting} style={{ ...buttonPrimary, cursor: 'pointer' }}>
        {exporting ? 'Exporting…' : 'Download confirmed voters (CSV)'}
      </button>
      <button type="button" onClick={load} style={{ ...buttonGhost, cursor: 'pointer', marginLeft: '10px' }}>Refresh</button>
    </Page>
  );
}

const inputStyle = {
  display: 'block', width: '100%', marginTop: '4px', padding: '10px 12px',
  border: `1px solid ${color.line}`, borderRadius: radius.md, background: '#fff', color: '#17170F',
  fontFamily: 'inherit', fontSize: '14px', boxSizing: 'border-box',
};

function Page({ children }) {
  return (
    <div style={{ padding: `${space.xl} 0 ${space.xxxl}` }}>
      <div style={container}>{children}</div>
    </div>
  );
}