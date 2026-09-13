export default function Button({ children, variant = 'primary', type = 'button', ...props }) {
  const className = `btn btn-${variant}`;

  return (
    <button type={type} className={className} {...props}>
      {children}
    </button>
  );
}
