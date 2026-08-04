import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { color, font, radius, space } from '../styles/tokens';

export default function DirectMessages(props) {
  const cohortId = props.cohortId;
  const roster = props.roster || [];
  const { profile } = useAuth();
  const [recipientId, setRecipientId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (roster.length && !recipientId) setRecipientId(roster[0].id);
  }, [roster]);

  useEffect(() => {
    if (!cohortId || !recipientId) return;

    loadMessages();

    const channel = supabase
      .channel(`dm-${cohortId}-${profile.id}-${recipientId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `cohort_id=eq.${cohortId}` },
        (payload) => {
          const m = payload.new;
          const involvesThisPair =
            (m.sender_id === profile.id && m.recipient_id === recipientId) ||
            (m.sender_id === recipientId && m.recipient_id === profile.id);
          if (involvesThisPair) setMessages((current) => [...current, m]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cohortId, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    const { data } = await supabase
      .from('direct_messages')
      .select('*')
      .eq('cohort_id', cohortId)
      .or(`and(sender_id.eq.${profile.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${profile.id})`)
      .order('created_at', { ascending: true })
      .limit(200);
    setMessages(data || []);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !recipientId) return;

    const body = text.trim();
    setText('');

    await supabase.from('direct_messages').insert({
      cohort_id: cohortId,
      sender_id: profile.id,
      recipient_id: recipientId,
      sender_name: profile.full_name || profile.email,
      body,
    });
  }

  return (
    <div style={{ background: color.bgRaised, border: `1px solid ${color.line}`, borderRadius: radius.lg, display: 'flex', flexDirection: 'column', height: '440px', overflow: 'hidden' }}>
      <div style={{ padding: space.md, borderBottom: `1px solid ${color.line}` }}>
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '8px' }}>
          Direct Messages
        </div>
        {roster.length === 0 ? (
          <p style={{ fontFamily: font.body, fontSize: '13px', color: color.mutedDim }}>No one to message yet.</p>
        ) : (
          <select
            className="lynk-input"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            style={{
              width: '100%',
              fontFamily: font.body,
              fontSize: '14px',
              color: color.white,
              background: color.bg,
              border: `1px solid ${color.line}`,
              borderRadius: radius.md,
              padding: '10px 12px',
              outline: 'none',
            }}
          >
            {roster.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: space.md, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <p style={{ fontFamily: font.body, fontSize: '14px', color: color.mutedDim }}>No messages yet.</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === profile.id;
          return (
            <div key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
              <div
                style={{
                  background: isMine ? color.cyan : color.bgRaised2,
                  color: isMine ? color.bg : color.white,
                  borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 16px',
                  fontFamily: font.body,
                  fontSize: '14px',
                  lineHeight: 1.4,
                }}
              >
                {m.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', padding: space.sm, borderTop: `1px solid ${color.line}` }}>
        <input
          className="lynk-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          style={{
            flex: 1,
            fontFamily: font.body,
            fontSize: '14px',
            color: color.white,
            background: color.bg,
            border: `1px solid ${color.line}`,
            borderRadius: radius.pill,
            padding: '10px 16px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: font.body,
            fontWeight: 600,
            fontSize: '14px',
            color: color.bg,
            background: color.cyan,
            border: 'none',
            borderRadius: radius.pill,
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}