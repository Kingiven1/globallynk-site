// The Mix Lab logo — one place to update. Swap src/assets/images/mix-lab-logo.png
// (keep the same filename) and the homepage strip + /mix-lab page both update.

import logo from '../assets/images/mix-lab-logo.png';

export default function MixLabLogo({ height = 56 }) {
  return <img src={logo} alt="The Mix Lab" style={{ height: `${height}px`, width: 'auto', display: 'block' }} />;
}