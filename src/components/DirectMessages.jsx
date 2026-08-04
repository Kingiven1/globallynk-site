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
    <div style={{ border: `1px solid ${color.line}`, borderRadius: radius.lg, display: 'flex', flexDirection: 'column', height: '420px' }}>
      <div style={{ padding: space.sm, borderBottom: `1px solid ${color.line}` }}>
        <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: '6px' }}>
          Direct Messages
        </div>
        {roster.length === 0 ? (
          <p style={{ fontFamily: font.body, fontSize: '13px', color: color.mutedDim }}>No one to message yet.</p>
        ) : (
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            style={{
              width: '100%',
              fontFamily: font.body,
              fontSize: '13px',
              color: color.white,
              background: color.bgRaised,
              border: `1px solid ${color.line}`,
              borderRadius: radius.sm,
              padding: '8px 10px',
              outline: 'none',
            }}
          >
            {roster.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: space.sm, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 && (
          <p style={{ fontFamily: font.body, fontSize: '13px', color: color.mutedDim }}>No messages yet.</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === profile.id;
          return (
            <div key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ fontFamily: font.mono, fontSize: '10px', color: color.mutedDim, marginBottom: '2px', textAlign: isMine ? 'right' : 'left' }}>
                {isMine ? 'You' : m.sender_name}
              </div>
              <div
                style={{
                  background: isMine ? color.cyanFaint : color.bgRaised2,
                  border: `1px solid ${isMine ? color.cyanDim : color.line}`,
                  borderRadius: radius.md,
                  padding: '8px 12px',
                  fontFamily: font.body,
                  fontSize: '14px',
                  color: color.white,
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          style={{
            flex: 1,
            fontFamily: font.body,
            fontSize: '14px',
            color: color.white,
            background: color.bgRaised,
            border: `1px solid ${color.line}`,
            borderRadius: radius.sm,
            padding: '10px 12px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            fontFamily: font.mono,
            fontSize: '12px',
            color: color.bg,
            background: color.cyan,
            border: 'none',
            borderRadius: radius.sm,
            padding: '10px 16px',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}