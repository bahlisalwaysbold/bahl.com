export function ArrowIcon() { return <span aria-hidden="true">↗</span>; }
export function CheckIcon() { return <span aria-hidden="true">✓</span>; }
export function MenuIcon() { return <span aria-hidden="true">☰</span>; }
export function CloseIcon() { return <span aria-hidden="true">×</span>; }
export function PhoneIcon() { return <span aria-hidden="true">⌕</span>; }
export function PinIcon() { return <span aria-hidden="true">⌖</span>; }

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.89 9.89m20.52-18.4C18.24 1.24 15.24 0 12.05 0 5.46 0 .1 5.36.1 11.94c0 2.1.55 4.15 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.69 1.45h.01c6.58 0 11.94-5.36 11.94-11.95a11.87 11.87 0 0 0-3.48-8.41"
      />
    </svg>
  );
}
