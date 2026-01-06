interface IIcon {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const Icon = ({ title, className, children }: IIcon) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {children}
    </svg>
  );
};

export default Icon;
