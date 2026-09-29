export default function BahlFlap() {
  const birdPath = 'M 45.80 16.10 L 67.10 42.20 L 88.60 50.30 L 94.40 53.40 L 98.60 57.80 L 98.70 63.30 L 95.40 58.10 L 90.30 53.80 L 52.80 39.50 L 52.80 40.90 L 67.50 58.10 L 83.60 63.60 L 70.80 87.40 L 71.10 89.20 L 95.90 73.10 L 102.00 66.60 L 115.40 47.90 L 124.70 41.40 L 124.10 39.80 L 118.50 38.50 L 108.20 39.80 L 98.70 45.10 L 101.60 50.70 L 85.40 36.70 L 47.30 15.90 Z';
  return (
    <svg className="bahl-flap" viewBox="35 4 100 108" role="img" aria-label="BAHL bird mark">
      <defs>
        <clipPath id="bahl-flap-upper"><rect x="36" y="4" width="100" height="58" rx="2" /></clipPath>
        <clipPath id="bahl-flap-lower"><rect x="36" y="52" width="100" height="60" rx="2" /></clipPath>
      </defs>
      <path className="bahl-flap__base" d={birdPath} fill="currentColor" />
      <g className="bahl-flap__wings" aria-hidden="true">
        <path className="bahl-flap__wing bahl-flap__upper" d={birdPath} clipPath="url(#bahl-flap-upper)" fill="currentColor" />
        <path className="bahl-flap__wing bahl-flap__lower" d={birdPath} clipPath="url(#bahl-flap-lower)" fill="currentColor" />
      </g>
    </svg>
  );
}
