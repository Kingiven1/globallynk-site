import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { color, font, radius, space } from '../styles/tokens';

export default function ClassChat(props) {
  const cohortId = props.cohortId;
  const { profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!cohortId) return;

    loadMessages();

    const channel = supabase
      .channel(`cohort-chat-${cohortId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cohort_messages', filter: `cohort_id=eq.${cohortId}` },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cohortId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages() {
    const { data } = await supabase
      .from('cohort_messages')
      .select('*')
      .eq('cohort_id', cohortId)
      .order('created_at', { ascending: true })
      .limit(100);
    setMessages(data || []);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const body = text.trim();
    setText('');

    await supabase.from('cohort_messages').insert({
      cohort_id: cohortId,
      sender_id: profile.id,
      sender_name: profile.full_name || profile.email,
      body,
    });
  }

  return (
    <div style={{ background: color.bgRaised, border: `1px solid ${color.line}`, borderRadius: radius.lg, display: 'flex', flexDirection: 'column', height: '440px', overflow: 'hidden' }}>
      <div style={{ padding: `${space.sm} ${space.md}`, borderBottom: `1px solid ${color.line}`, fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white }}>
        Class Chat
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: space.md, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <p style={{ fontFamily: font.body, fontSize: '14px', color: color.mutedDim }}>No messages yet — say hi.</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === profile.id;
          return (
            <div key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
              {!isMine && (
                <div style={{ fontFamily: font.body, fontSize: '11px', color: color.mutedDim, marginBottom: '3px', paddingLeft: '4px' }}>
                  {m.sender_name}
                </div>
              )}
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
          placeholder="Message the class…"
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