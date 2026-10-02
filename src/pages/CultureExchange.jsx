import { useState, useEffect, useRef } from 'react';
import {
  color, eyebrow, h1, h2, h3, body, bodyLg, card, radius,
  buttonPrimary, buttonGhost, container, section, space, font,
} from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// EDITABLE CONFIGURATION
// Everything that changes routinely (phase, flyer, the Tally form) lives
// here. Nothing below this block should need to change for a normal update.
// ──────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // One of: 'applications_open' | 'applications_closed' | 'public_voting'
  //       | 'finalists_announced' | 'winners_announced'
  // This is the ONLY thing you change to move the page to the next phase of
  // the competition. Only one phase is active at a time, and only
  // 'applications_open' is fully built right now — the others show a simple
  // placeholder until the voting/finalists/winners sections get built.
  phase: 'applications_open',

  // Set to an imported image once final artwork is ready, e.g.:
  // import flyer from '../assets/images/culture-exchange-flyer.png';
  // then set flyerImage: flyer
  flyerImage: null,

  // The official Tally application. Paste the form's share URL here
  // (tally.so/r/XXXXXX) — used for both the embed and the fallback
  // "open in a new window" link.
  TALLY_FORM_URL: 'https://tally.so/r/A71RRo',

  applicationsOpenDate: 'October 5, 2026',
  round1Deadline: 'October 19, 2026',
};

const PHASE_HERO = {
  applications_open: {
    eyebrow: 'Global Lynk Culture Exchange 2027',
    headline: 'Your sound could take you to Mexico City.',
    body: "Global Lynk is searching for two DJs—one woman and one man—to represent our creative community during the 2027 Culture Exchange in Mexico City. This is more than a DJ battle. It is a three-round competition designed to identify DJs with musical versatility, technical ability, cultural knowledge, professionalism and the ability to connect with a crowd.",
    ctaLabel: 'APPLY NOW',
    ctaAction: 'scroll-to-apply',
  },
  applications_closed: {
    eyebrow: 'Global Lynk Culture Exchange 2027',
    headline: 'Applications are closed.',
    body: 'Round 1 review is underway. Semifinalists will be announced soon — check back for public voting.',
    ctaLabel: 'APPLICATIONS CLOSED',
    ctaAction: 'none',
  },
  public_voting: {
    eyebrow: 'Global Lynk Culture Exchange 2027',
    headline: 'Vote for the next Culture Exchange DJs.',
    body: 'Meet the semifinalists and help select the 10 DJs who will compete live in Charlotte.',
    ctaLabel: 'VOTE NOW',
    ctaAction: 'scroll-to-apply',
  },
  finalists_announced: {
    eyebrow: 'Global Lynk Culture Exchange 2027',
    headline: 'Meet the 2027 Culture Exchange finalists.',
    body: 'Ten DJs are advancing to the live finals in Charlotte.',
    ctaLabel: 'MEET THE FINALISTS',
    ctaAction: 'scroll-to-apply',
  },
  winners_announced: {
    eyebrow: 'Global Lynk Culture Exchange 2027',
    headline: 'Meet the 2027 Culture Exchange winners.',
    body: 'Two DJs are headed to Mexico City with Global Lynk.',
    ctaLabel: 'MEET THE WINNERS',
    ctaAction: 'scroll-to-apply',
  },
};

const ROUNDS = [
  {
    tag: 'ROUND 1',
    title: 'APPLICATION + VIDEO',
    dates: 'October 5–19',
    copy: "Submit your application and one-minute DJ performance through our Tally form. King Iven, DJ K-Mil and DJ Meechie will each review eligible entries independently. An applicant must receive at least two of the three votes to enter the semifinalist pool. Up to 20 semifinalists will advance—up to 10 women and 10 men.",
  },
  {
    tag: 'ROUND 2',
    title: 'PUBLIC VOTE',
    dates: 'November 5–12',
    copy: 'Approved semifinalists are featured on this page for public voting. The public vote determines the 10 live finalists: five women, five men. Finalists are announced November 13.',
  },
  {
    tag: 'ROUND 3',
    title: 'LIVE FINALS',
    dates: 'December 12 or 13',
    copy: 'The 10 finalists compete in person in Charlotte through a series of music, culture and live-DJ challenges. A three-person judging panel selects one woman and one man for the 2027 Mexico City Culture Exchange.',
  },
];

const REQUIREMENTS = [
  'Exactly one minute of performance',
  'Exactly four songs',
  'At least two genres',
  'At least one live mashup or live blend',
  'Clear, understandable audio',
  'DJ and controller visible, hands visible during transitions',
  'One continuous performance take',
];

const NOT_ALLOWED = [
  'Premade mashups',
  'Prerecorded DJ routines',
  'Edited or hidden transitions',
  'Multiple performance takes combined',
  'Time manipulation or speed changes',
  'A separately recorded replacement performance',
];

const VIDEO_SPECS = [
  'Accepted formats: MP4 or MOV',
  '1080p preferred, 720p minimum',
  'Vertical or horizontal accepted',
  'Clear lighting and clear audio',
  'No excessive filters',
];

const PHOTO_REQUIREMENTS = [
  'One clear, recent DJ photo — high-resolution JPG or PNG',
  'No screenshots, no event flyers, no text covering the face',
  "You should be clearly identifiable, and you must own the photo or have permission to submit it",
  'May be used later for the semifinalist voting profile and competition promotion',
];

const ELIGIBILITY = [
  'Be at least 21 years old by the 2027 Culture Exchange trip',
  'Possess a valid passport',
  'Be legally able to travel internationally',
  'Be available for the finalized Mexico City travel dates',
  'Be able to travel to Charlotte for the live finals at their own expense',
  'Submit a complete application before the deadline',
  'Follow all Round 1 submission requirements',
  'Agree to the competition, public-voting, media and community-conduct rules',
  'Be willing to represent Global Lynk professionally',
];

const TIMELINE = [
  { date: 'October 5, 2026', label: 'Applications open.' },
  { date: 'October 19, 2026', label: 'Applications and Round 1 submissions close.' },
  { date: 'October 20–November 4, 2026', label: 'Global Lynk review period.' },
  { date: 'November 5, 2026', label: 'Semifinalists announced and public voting begins.' },
  { date: 'November 12, 2026', label: 'Public voting closes.' },
  { date: 'November 13, 2026', label: 'Ten live finalists announced.' },
  { date: 'December 12 or 13, 2026', label: 'Live finals in Charlotte.' },
  { date: 'Spring 2027', label: 'Mexico City Culture Exchange.' },
];

const TRAVEL_WINDOWS = ['March 18–22', 'April 8–12', 'April 29–May 3', 'May 13–17', 'May 20–24'];

const MEXICO_EXPERIENCE = [
  'Connections with local DJs and creative communities',
  'Music and nightlife experiences',
  'Cultural and culinary exploration',
  'Creative and professional content opportunities',
  'Global Lynk storytelling and visibility',
  'Continued participation in the Global Lynk alumni ecosystem',
];

const FAQS = [
  {
    q: 'Where do I submit my application and video?',
    a: 'Through our official Tally application form, embedded on this page. If it has trouble loading, use the "open in a new window" link below the form.',
  },
  {
    q: 'Do I have to live in Charlotte?',
    a: 'No. DJs from other cities and markets may apply. Finalists must travel to Charlotte for the live competition at their own expense.',
  },
  {
    q: 'Do I need a passport?',
    a: 'Yes. Applicants must possess a valid passport and be legally eligible to travel internationally.',
  },
  {
    q: 'Can I use a premade mashup?',
    a: 'No. The required mashup or blend must be created live during the recorded performance.',
  },
  {
    q: 'Can I edit my submission video?',
    a: 'The DJ performance must be shown in one continuous take. Cuts, hidden transitions, prerecorded routines and time manipulation are prohibited.',
  },
  {
    q: 'Can my mix be longer than one minute?',
    a: 'No. The submitted performance must be exactly one minute.',
  },
  {
    q: "What if my video is too large to upload directly?",
    a: 'If the application form cannot accept your file size, provide an accessible link instead (Google Drive, Dropbox, Vimeo, or an unlisted YouTube link). Make sure the link does not require us to request access, stays active throughout the competition, and can be viewed or downloaded by the review team.',
  },
  {
    q: 'Who reviews the first round?',
    a: "King Iven, DJ K-Mil and DJ Meechie review the eligible submissions independently. An applicant must receive at least two of the three votes to enter the semifinalist pool.",
  },
  {
    q: 'How are the live finalists selected?',
    a: 'The public votes through this page from November 5 through November 12.',
  },
  {
    q: 'When will the live finals happen?',
    a: 'The live finals are currently planned for December 12 or 13 in Charlotte. The exact date, venue and time will be announced soon.',
  },
  {
    q: 'Who pays for travel to Charlotte?',
    a: 'Finalists are responsible for their transportation and accommodations related to the Charlotte live finals.',
  },
  {
    q: 'What do the winners receive?',
    a: 'One woman and one man will be selected to participate in the 2027 Global Lynk Culture Exchange in Mexico City. Final travel coverage, trip inclusions and itinerary details will be shared before the live finals.',
  },
];

export default function CultureExchange() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [tallyFailed, setTallyFailed] = useState(false);

  const heroRef = useRef(null);
  const applyRef = useRef(null);
  const round1Ref = useRef(null);

  const phaseContent = PHASE_HERO[CONFIG.phase] || PHASE_HERO.applications_open;
  const isApplicationsOpen = CONFIG.phase === 'applications_open';

  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      setShowStickyBar(heroBottom < 0);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loads Tally's embed script once, which upgrades the iframe below into a
  // dynamic-height embed (the form resizes as applicants move between
  // sections instead of showing a fixed-height scrollbar).
  useEffect(() => {
    if (!isApplicationsOpen) return;

    if (window.Tally) {
      window.Tally.loadEmbeds();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    script.onerror = () => setTallyFailed(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isApplicationsOpen]);

  function scrollToApply() {
    applyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToRound1() {
    round1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section ref={heroRef} style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xl}`, overflow: 'hidden' }}>
        <div
          style={{ ...container, position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.xl, alignItems: 'center' }}
          className="ce-hero-grid"
        >
          <div className="ce-hero-flyer">
            {CONFIG.flyerImage ? (
              <img
                src={CONFIG.flyerImage}
                alt="Global Lynk Culture Exchange 2027"
                style={{ width: '100%', height: 'auto', borderRadius: radius.lg, boxShadow: '0 30px 80px rgba(0,0,0,0.15)' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  background: color.bgRaised2,
                  border: `1px dashed ${color.line}`,
                  borderRadius: radius.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: space.lg,
                  gap: '8px',
                }}
              >
                <span style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.05em', color: color.mutedDim }}>
                  EVENT FLYER PLACEHOLDER
                </span>
                <span style={{ fontFamily: font.body, fontSize: '13px', color: color.mutedDim, maxWidth: '280px' }}>
                  Replace with the final Culture Exchange 2027 flyer — swap <code>CONFIG.flyerImage</code> in CultureExchange.jsx
                </span>
              </div>
            )}
          </div>

          <div>
            <div style={eyebrow}><span>{phaseContent.eyebrow}</span></div>
            <h1 style={{ ...h1, fontSize: 'clamp(32px, 5vw, 56px)' }}>{phaseContent.headline}</h1>
            <p style={{ ...bodyLg, marginTop: space.md }}>{phaseContent.body}</p>

            {isApplicationsOpen && (
              <div style={{ display: 'flex', gap: space.lg, marginTop: space.md, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim }}>APPLICATIONS OPEN</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white }}>{CONFIG.applicationsOpenDate}</div>
                </div>
                <div>
                  <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim }}>ROUND 1 DEADLINE</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white }}>{CONFIG.round1Deadline}</div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: space.sm, marginTop: space.lg, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={phaseContent.ctaAction === 'scroll-to-apply' ? scrollToApply : undefined}
                disabled={phaseContent.ctaAction === 'none'}
                style={{ ...buttonPrimary, opacity: phaseContent.ctaAction === 'none' ? 0.6 : 1, cursor: phaseContent.ctaAction === 'none' ? 'default' : 'pointer' }}
              >
                {phaseContent.ctaLabel} →
              </button>
              {isApplicationsOpen && (
                <button
                  onClick={scrollToRound1}
                  style={{ background: 'none', border: 'none', fontFamily: font.mono, fontSize: '13px', letterSpacing: '0.01em', color: color.cyan, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  VIEW ROUND 1 RULES
                </button>
              )}
            </div>

            {isApplicationsOpen && (
              <p style={{ ...body, fontSize: '13px', marginTop: space.sm }}>
                Open to DJs in Charlotte and other markets. Finalists must be able to travel to Charlotte for the live competition.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────── MISSION STATEMENT ─────────────────────── */}
      <section style={section}>
        <div style={{ ...container, maxWidth: '760px' }}>
          <div style={eyebrow}><span>More than a competition</span></div>
          <h2 style={{ ...h2, marginBottom: space.md }}>What this is really about.</h2>
          <p style={{ ...bodyLg, marginBottom: space.sm }}>
            The Global Lynk Culture Exchange uses music as a pathway to cultural connection, creative
            growth and international opportunity.
          </p>
          <p style={{ ...body, marginBottom: space.sm }}>
            We are looking for DJs who are ready to learn, represent their communities and experience
            music beyond their home market—not simply competitors looking for attention.
          </p>
          <p style={body}>
            The selected DJs will become part of the Global Lynk alumni ecosystem and help build the
            opportunity for future participants.
          </p>
        </div>
      </section>

      {/* ─────────────────────── THE OPPORTUNITY ─────────────────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>The opportunity</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg, maxWidth: '640px' }}>What are you competing for?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: space.xl, alignItems: 'start' }} className="ce-opportunity-grid">
            <div>
              <p style={{ ...bodyLg, marginBottom: space.sm }}>
                Two DJs will be selected to join Global Lynk for the 2027 Culture Exchange in Mexico City:
                one woman, one man.
              </p>
              <p style={{ ...body, marginBottom: space.md }}>
                The experience will center music, cultural exploration, creative community, food,
                nightlife and international relationship-building. Winners will also receive continued
                visibility through Global Lynk and become part of the Culture Exchange alumni community.
              </p>
              <div style={{ ...card, padding: space.md, borderLeft: `3px solid ${color.cyan}` }}>
                <p style={{ ...body, fontSize: '14px', margin: 0 }}>
                  Final travel coverage, trip inclusions and the official itinerary will be shared before
                  the live finals.
                </p>
              </div>
            </div>

            <div
              style={{
                ...card,
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: space.md,
              }}
            >
              <span style={{ fontFamily: font.mono, fontSize: '11px', color: color.mutedDim, textAlign: 'center' }}>
                [ 2026 Mexico City Culture Exchange photo/video ]
              </span>
            </div>
          </div>

          <p style={{ ...body, fontSize: '13px', marginTop: space.md, maxWidth: '640px' }}>
            In 2026, DJ K-Mil and DJ Meechie earned the opportunity to represent Global Lynk in Mexico
            City. They are returning as members of the production team to help us identify and prepare
            the next winners.
          </p>
        </div>
      </section>

      {/* ─────────────────────── HOW IT WORKS ─────────────────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>How the competition works</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg, maxWidth: '640px' }}>Three rounds. Two spots.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.lg }} className="ce-rounds-grid">
            {ROUNDS.map((r) => (
              <div key={r.tag} style={{ ...card, padding: space.lg }}>
                <div style={{ fontFamily: font.mono, fontSize: '11px', letterSpacing: '0.05em', color: color.cyanDim, marginBottom: '6px' }}>
                  {r.tag}
                </div>
                <h3 style={{ ...h3, marginBottom: '4px' }}>{r.title}</h3>
                <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.mutedDim, marginBottom: space.sm }}>{r.dates}</div>
                <p style={{ ...body, fontSize: '14px' }}>{r.copy}</p>
              </div>
            ))}
          </div>

          <p style={{ ...body, fontSize: '13px', marginTop: space.md }}>
            The final live-event date, venue, time, judges and scoring system will be announced separately.
          </p>
        </div>
      </section>

      {/* ─────────────────────── ROUND 1 REQUIREMENTS ─────────────────────── */}
      <section ref={round1Ref} style={{ ...section, background: color.bgRaised }}>
        <div style={container}>
          <div style={eyebrow}><span>Round 1</span></div>
          <h2 style={{ ...h2, marginBottom: space.sm }}>The one-minute mix.</h2>
          <p style={{ ...bodyLg, maxWidth: '640px', marginBottom: space.lg }}>
            Show us what you can do in 60 seconds. Your submission should demonstrate music selection,
            transitions, creativity, versatility and your ability to create a complete musical moment
            under pressure.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.lg }} className="ce-requirements-grid">
            <div style={{ ...card, padding: space.lg }}>
              <h3 style={{ ...h3, fontSize: '16px', color: color.cyan, marginBottom: space.sm, fontFamily: font.mono, letterSpacing: '0.03em' }}>
                YOUR MIX MUST INCLUDE
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {REQUIREMENTS.map((req) => (
                  <li key={req} style={{ ...body, fontSize: '14px' }}>{req}</li>
                ))}
              </ul>
            </div>
            <div style={{ ...card, padding: space.lg }}>
              <h3 style={{ ...h3, fontSize: '16px', color: '#D1455B', marginBottom: space.sm, fontFamily: font.mono, letterSpacing: '0.03em' }}>
                NOT ALLOWED
              </h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {NOT_ALLOWED.map((item) => (
                  <li key={item} style={{ ...body, fontSize: '14px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.lg, marginTop: space.lg }} className="ce-requirements-grid">
            <div style={{ ...card, padding: space.lg }}>
              <h3 style={{ ...h3, fontSize: '15px', marginBottom: '8px' }}>Video specs</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {VIDEO_SPECS.map((item) => (
                  <li key={item} style={{ ...body, fontSize: '13px' }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ ...card, padding: space.lg }}>
              <h3 style={{ ...h3, fontSize: '15px', marginBottom: '8px' }}>Photo requirements</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {PHOTO_REQUIREMENTS.map((item) => (
                  <li key={item} style={{ ...body, fontSize: '13px' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ ...card, padding: space.lg, marginTop: space.lg }}>
            <h3 style={{ ...h3, fontSize: '15px', marginBottom: '8px' }}>What counts as a live mashup?</h3>
            <p style={{ ...body, fontSize: '14px', marginBottom: space.sm }}>
              A live mashup or blend means combining elements from two songs during the recorded
              performance using your DJ equipment. Downloading and playing a mashup that was created
              beforehand does not meet this requirement.
            </p>
            <p style={{ ...body, fontSize: '13px', margin: 0, color: color.mutedDim }}>
              Direct controller audio may be used if it comes from the exact performance shown in the
              video and remains synchronized with the footage.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────── ELIGIBILITY ─────────────────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Eligibility</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg, maxWidth: '640px' }}>Who can apply?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 40px', marginBottom: space.lg }} className="ce-eligibility-grid">
            {ELIGIBILITY.map((item) => (
              <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: color.cyan, fontFamily: font.mono, fontSize: '14px', lineHeight: '1.6' }}>—</span>
                <span style={{ ...body, fontSize: '15px' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ ...card, padding: space.lg, borderLeft: `3px solid ${color.cyan}`, marginBottom: space.md }}>
            <h3 style={{ ...h3, fontSize: '16px', marginBottom: '6px' }}>You do not have to live in Charlotte.</h3>
            <p style={{ ...body, fontSize: '14px', margin: 0 }}>
              DJs from other cities and markets are encouraged to apply. If selected as a finalist, you
              will be responsible for your transportation and accommodations related to the Charlotte
              live finals.
            </p>
          </div>

          <p style={{ ...body, fontSize: '13px' }}>
            Proof of age, identity and passport eligibility may be requested before a finalist is
            officially confirmed.
          </p>
        </div>
      </section>

      {/* ─────────────────────── IMPORTANT DATES ─────────────────────── */}
      <section style={{ ...section, background: color.bgRaised }}>
        <div style={{ ...container, maxWidth: '720px' }}>
          <div style={eyebrow}><span>Important dates</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg }}>Timeline.</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TIMELINE.map((t, i) => (
              <div key={t.date} style={{ display: 'flex', gap: space.md, paddingBottom: i === TIMELINE.length - 1 ? 0 : space.md }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color.cyan, flexShrink: 0 }} />
                  {i !== TIMELINE.length - 1 && <div style={{ flex: 1, width: '1px', background: color.line, marginTop: '4px' }} />}
                </div>
                <div style={{ paddingBottom: space.sm }}>
                  <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: '2px' }}>{t.date}</div>
                  <div style={{ ...body, fontSize: '15px' }}>{t.label}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...body, fontSize: '13px', marginTop: space.md }}>
            Dates are subject to reasonable changes. Any official updates will be communicated directly
            to applicants.
          </p>
        </div>
      </section>

      {/* ─────────────────────── MEXICO CITY EXPERIENCE ─────────────────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>The culture exchange</span></div>
          <h2 style={{ ...h2, marginBottom: space.md, maxWidth: '640px' }}>It doesn't end when the winners are announced.</h2>
          <p style={{ ...bodyLg, maxWidth: '680px', marginBottom: space.lg }}>
            The two selected DJs will travel with Global Lynk to Mexico City for an experience built
            around music, cultural exploration, international creative community and professional growth.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.xl }} className="ce-mexico-grid">
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MEXICO_EXPERIENCE.map((item) => (
                <li key={item} style={{ ...body, fontSize: '15px' }}>{item}</li>
              ))}
            </ul>

            <div style={{ ...card, padding: space.lg }}>
              <h3 style={{ ...h3, fontSize: '15px', marginBottom: space.sm }}>Proposed 2027 travel windows</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: space.sm }}>
                {TRAVEL_WINDOWS.map((w) => (
                  <div key={w} style={{ fontFamily: font.mono, fontSize: '13px', color: color.white }}>{w}</div>
                ))}
              </div>
              <p style={{ ...body, fontSize: '12px', margin: 0, color: color.mutedDim }}>
                April and May are currently the preferred travel windows. The Tally application asks you
                to identify every proposed date you're available. The final travel dates and covered trip
                expenses will be confirmed before the live finals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── APPLICATION (TALLY EMBED) ─────────────────────── */}
      <section ref={applyRef} style={{ ...section, background: color.bgRaised }}>
        <div style={{ ...container, maxWidth: '760px' }}>
          {isApplicationsOpen ? (
            <>
              <div style={eyebrow}><span>Apply</span></div>
              <h2 style={{ ...h2, marginBottom: space.sm }}>Apply for the 2027 Culture Exchange.</h2>
              <p style={{ ...bodyLg, marginBottom: space.lg }}>
                Complete the application and submit your one-minute DJ performance by {CONFIG.round1Deadline}.
                Incomplete, inaccessible or late submissions may not be reviewed.
              </p>

              <div style={{ ...card, padding: space.sm, overflow: 'hidden' }}>
                <iframe
                  data-tally-src={`${CONFIG.TALLY_FORM_URL}?transparentBackground=1&dynamicHeight=1`}
                  title="2027 Culture Exchange Application"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  style={{ display: 'block', border: 'none', borderRadius: radius.md }}
                  onError={() => setTallyFailed(true)}
                />
              </div>

              <div style={{ textAlign: 'center', marginTop: space.md }}>
                <p style={{ ...body, fontSize: '13px', marginBottom: '8px' }}>
                  Having trouble viewing the application?
                </p>
                <a
                  href={CONFIG.TALLY_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={buttonGhost}
                >
                  OPEN THE APPLICATION IN A NEW WINDOW →
                </a>
              </div>
            </>
          ) : (
            <div style={{ ...card, padding: space.xl, textAlign: 'center' }}>
              <h3 style={{ ...h3, fontSize: '20px', marginBottom: space.sm }}>
                {CONFIG.phase === 'applications_closed' && 'Applications are currently closed.'}
                {CONFIG.phase === 'public_voting' && 'The semifinalist voting gallery is coming soon.'}
                {CONFIG.phase === 'finalists_announced' && 'The finalists showcase is coming soon.'}
                {CONFIG.phase === 'winners_announced' && 'The winners showcase is coming soon.'}
              </h3>
              <p style={{ ...body, maxWidth: '480px', margin: '0 auto' }}>
                Check back here, or follow @globallynk for updates on the next phase of the competition.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────── FAQ ─────────────────────── */}
      <section style={section}>
        <div style={{ ...container, maxWidth: '760px' }}>
          <div style={eyebrow}><span>FAQ</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg }}>Frequently asked questions.</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={item.q} style={{ ...card, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: space.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '15px',
                      color: color.white,
                    }}
                  >
                    {item.q}
                    <span style={{ fontFamily: font.mono, fontSize: '16px', color: color.cyan, marginLeft: space.md, flexShrink: 0 }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: `0 ${space.md} ${space.md}` }}>
                      <p style={{ ...body, fontSize: '14px', margin: 0 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────── FINAL CTA ─────────────────────── */}
      {isApplicationsOpen && (
        <section style={{ ...section, paddingBottom: space.xxl }}>
          <div
            style={{
              ...container,
              ...card,
              padding: space.xl,
              textAlign: 'center',
            }}
          >
            <h2 style={{ ...h2, fontSize: 'clamp(26px, 3.5vw, 36px)', marginBottom: space.sm, maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
              Ready to take your sound somewhere new?
            </h2>
            <p style={{ ...bodyLg, maxWidth: '560px', margin: `0 auto ${space.sm}` }}>
              You do not have to come from the biggest market or have the largest following. You do need
              to demonstrate skill, versatility, creativity, professionalism and a genuine willingness to
              experience another culture.
            </p>
            <p style={{ ...body, marginBottom: space.lg }}>Applications close {CONFIG.round1Deadline}.</p>
            <button onClick={scrollToApply} style={buttonPrimary}>APPLY NOW →</button>
          </div>
        </section>
      )}

      {/* ─────────────────────── STICKY MOBILE APPLY BAR ─────────────────────── */}
      {showStickyBar && isApplicationsOpen && (
        <div
          className="ce-sticky-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            background: color.bgRaised,
            borderTop: `1px solid ${color.line}`,
            padding: space.sm,
            display: 'none',
          }}
        >
          <button onClick={scrollToApply} style={{ ...buttonPrimary, width: '100%', justifyContent: 'center' }}>
            APPLY NOW →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .ce-hero-grid { grid-template-columns: 1fr !important; }
          .ce-hero-flyer { order: -1; }
          .ce-opportunity-grid { grid-template-columns: 1fr !important; }
          .ce-rounds-grid { grid-template-columns: 1fr !important; }
          .ce-requirements-grid { grid-template-columns: 1fr !important; }
          .ce-eligibility-grid { grid-template-columns: 1fr !important; }
          .ce-mexico-grid { grid-template-columns: 1fr !important; }
          .ce-sticky-bar { display: block !important; }
        }
      `}</style>
    </div>
  );
}