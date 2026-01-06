import Icon from "../basic/icon";

const MinimizeIcon = ({ className }: { className?: string }) => {
  return (
    <Icon className={className} title="minimize-icon">
      <path d="M6 19h12v2H6z" />
    </Icon>
  );
};

export default MinimizeIcon;
