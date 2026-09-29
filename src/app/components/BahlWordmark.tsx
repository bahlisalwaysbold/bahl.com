export default function BahlWordmark({ light = true }: { light?: boolean }) {
  const fill = light ? '#FFFFFF' : '#07090C';
  return (
    <svg className="bahl-wordmark" viewBox="139 46 166 33" role="img" aria-label="BAHL" focusable="false">
      <path d="M151.30 67.50 L151.60 68.40 L156.70 68.00 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
      <path d="M272.70 50.80 L273.00 75.50 L301.20 75.10 L300.90 69.70 L279.50 69.60 L279.20 50.90 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
      <path d="M182.60 74.40 L183.10 75.70 L190.00 75.20 L201.20 59.60 L212.20 75.10 L219.50 75.00 L201.80 50.50 L198.80 52.10 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
      <path d="M228.80 50.80 L229.00 75.30 L235.10 75.20 L235.60 66.10 L242.70 66.00 L253.40 66.10 L253.80 75.40 L260.10 75.30 L260.00 50.60 L253.70 50.90 L253.40 59.70 L235.60 59.80 L235.20 50.80 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
      <path d="M173.10 54.00 L167.50 50.40 L144.20 50.70 L144.60 56.10 L166.10 56.20 L167.60 58.50 L166.40 59.70 L144.20 60.00 L143.90 75.20 L165.60 75.80 L172.20 74.20 L175.30 69.60 L175.20 65.00 L173.00 62.00 L174.20 59.40 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
      <path d="M168.70 67.30 L167.40 69.60 L150.10 69.30 L150.50 65.90 L166.60 65.70 Z" fill={fill} fillRule="evenodd" clipRule="evenodd"/>
    </svg>
  );
}
