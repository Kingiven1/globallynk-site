import { Link } from 'react-router-dom';
import { color, eyebrow, h1, h2, body, bodyLg, container, section, space, font } from '../styles/tokens';

// Plain-language privacy policy for globallynk.club.
// Keep the facts below in sync with what the site really does. If you add a new tool
// or collect something new, add it here. Have a lawyer review before relying on it.

const CONTACT = 'connect@indabooth.com';
const UPDATED = 'October 30, 2026';

const SECTIONS = [
  {
    title: 'What we collect',
    items: [
      'Mailing list and waitlists: your email address, and your city if you give it.',
      'Voting (Tables Turned): your name, email, and optional phone number, plus the DJs you voted for. To stop duplicate and fake votes we also keep a scrambled (hashed) version of your IP address and basic device information.',
      'Community Partner applications (The Mix Lab): your business and contact details and the answers you write in the application.',
      'Culture Exchange DJ applications and other forms: whatever you submit in the form, which may be handled through Tally.',
      'Accounts and the student portal: your name, email, and the messages and activity you create in the portal.',
      'Booking and contact requests: the details you send us so we can reply.',
      'Tickets and payments: tickets are sold through Posh and payments are handled by a payment processor such as Square. We do not see or store your full card number.',
    ],
  },
  {
    title: 'How we use it',
    items: [
      'To run what you signed up for: confirm your vote, review your application, send tickets or confirmations, and reply to your messages.',
      'To protect the competition and the site from spam, duplicate entries and abuse.',
      'To tell you about GlobalLYNK events, workshops and cohorts, but only if you opted in to hear from us. You can unsubscribe at any time.',
      'To understand how the site is used so we can improve it.',
    ],
  },
  {
    title: 'Who we share it with',
    body: 'We do not sell your personal information. We use trusted services to run the site, and they handle data on our behalf: our hosting provider (Vercel), our database and sign-in provider (Supabase), our email provider (Resend), form tools (Tally), ticketing (Posh) and payments (Square or another payment processor). We may share information if the law requires it. If you are selected as a finalist or winner, we may publish your name, photo and performance. We will not publish your email or phone number.',
  },
  {
    title: 'Voting and partner applications',
    body: 'Voting is private. We do not show who voted for whom. Vote counts stay hidden until voting closes. For Community Partner applications, your application details and contact information stay private. If you are approved, only the listing information you choose to provide, such as your business name, logo, description and link, will appear publicly.',
  },
  {
    title: 'Cookies and local storage',
    body: 'We use your browser storage to keep you signed in and to remember small things, such as a referral link you arrived from. We do not use it to sell advertising. Third-party tools on the site (for example embedded videos, forms or ticketing pages) may set their own cookies under their own policies.',
  },
  {
    title: 'How long we keep it',
    body: 'We keep information for as long as we need it for the purpose you gave it for, such as running a competition or an event season, keeping records, and meeting legal obligations. You can ask us to delete your information at any time (see below).',
  },
  {
    title: 'Your choices',
    items: [
      'Unsubscribe from any email using the link in the message, or email us.',
      `Ask to see, correct or delete the information we hold about you by emailing ${CONTACT}.`,
      'You can opt out of the mailing list without losing access to anything else.',
    ],
  },
  {
    title: 'Children',
    body: 'Our website is not meant for children under 13, and we do not knowingly collect their information. Some programs have their own age requirements.',
  },
  {
    title: 'Changes',
    body: 'If we change this policy, we will update the date at the top of the page.',
  },
];

export default function Privacy() {
  return (
    <div style={{ ...section }}>
      <div style={{ ...container, maxWidth: '760px' }}>
        <div style={eyebrow}><span>Privacy</span></div>
        <h1 style={{ ...h1, fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: space.sm }}>Privacy Policy</h1>
        <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: space.md }}>
          Last updated: {UPDATED}
        </p>
        <p style={{ ...bodyLg, marginBottom: space.lg }}>
          GlobalLYNK respects your privacy. This page explains in plain language what we collect when you use
          globallynk.club, why, and the choices you have.
        </p>

        {SECTIONS.map((s) => (
          <section key={s.title} style={{ marginBottom: space.lg }}>
            <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.sm }}>{s.title}</h2>
            {s.body && <p style={body}>{s.body}</p>}
            {s.items && (
              <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {s.items.map((i) => <li key={i} style={body}>{i}</li>)}
              </ul>
            )}
          </section>
        ))}

        <section style={{ marginBottom: space.lg }}>
          <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.sm }}>Contact us</h2>
          <p style={body}>
            Questions or requests about your information? Email{' '}
            <a href={`mailto:${CONTACT}`} style={{ color: color.cyan }}>{CONTACT}</a>.
          </p>
        </section>

        <Link to="/" style={{ fontFamily: font.mono, fontSize: '13px', color: color.cyan, textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}