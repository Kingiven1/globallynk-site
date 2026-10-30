import { Link, useSearchParams } from 'react-router-dom';
import { PartnerApplication } from '../components/MixLabPartnership';
import { font, container, space } from '../styles/tokens';

// The Community Partner application lives on its own page so it can be linked to directly.
// Example: /mix-lab/partner-application?package=featured preselects the Featured package.

export default function MixLabPartnerApply() {
  const [params] = useSearchParams();
  const initialPackage = params.get('package') || '';

  return (
    <div style={{ background: '#E4D9FF', minHeight: '70vh' }}>
      <div style={{ ...container, maxWidth: '720px', paddingTop: space.lg }}>
        <Link
          to="/mix-lab"
          style={{ fontFamily: font.mono, fontSize: '13px', color: '#2B3FD6', textDecoration: 'none' }}
        >
          ← Back to The Mix Lab
        </Link>
      </div>
      <PartnerApplication initialPackage={initialPackage} />
    </div>
  );
}