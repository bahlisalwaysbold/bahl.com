import Link from 'next/link';

type Variant = 'solid' | 'light' | 'ghost' | 'dark-ghost' | 'dark-outline' | 'whatsapp';
type Size = 'md' | 'sm';

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
};

type LinkProps = BaseProps & {
  href: string;
  external?: boolean;
  onClick?: () => void;
  type?: never;
  disabled?: never;
};

type ButtonProps = Omit<BaseProps, 'href'> & {
  href?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
};

const variantClass: Record<Variant, string> = {
  solid: 'btn--solid',
  light: 'btn--light',
  ghost: 'btn--ghost',
  'dark-ghost': 'btn--dark-ghost',
  'dark-outline': 'btn--dark-outline',
  whatsapp: 'btn--whatsapp',
};

function classes({ variant = 'solid', size = 'md', className = '' }: BaseProps) {
  return ['btn', variantClass[variant], size === 'sm' ? 'btn--sm' : '', className]
    .filter(Boolean)
    .join(' ');
}

function Body({ children, arrow }: { children: React.ReactNode; arrow?: boolean }) {
  return (
    <>
      {children}
      {arrow && <span aria-hidden="true">↗</span>}
    </>
  );
}

export default function Button(props: LinkProps | ButtonProps) {
  const { variant, size, className, children, arrow } = props;
  const cls = classes({ variant, size, className, children, arrow });

  if ('href' in props && props.href) {
    const { href, external } = props;
    const linkProps = external
      ? { href, target: '_blank' as const, rel: 'noopener noreferrer' }
      : { href };
    return (
      <Link className={cls} {...linkProps} onClick={props.onClick}>
        <Body arrow={arrow}>{children}</Body>
      </Link>
    );
  }

  const { type = 'button', disabled, onClick } = props as ButtonProps;
  return (
    <button className={cls} type={type} disabled={disabled} onClick={onClick}>
      <Body arrow={arrow}>{children}</Body>
    </button>
  );
}
