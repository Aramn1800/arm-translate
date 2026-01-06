import clsx from "clsx";

interface ICollapse {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

const Collapse = ({ open, className, children }: ICollapse) => {
  return (
    <div
      className={clsx(
        className,
        "grid min-h-0 overflow-hidden p-0 transition-all duration-300 ease-in-out",
        open ? "grid-rows-[1fr] p-2" : "grid-rows-[0fr]"
      )}
    >
      <div className="flex min-h-0 flex-col gap-4">{children}</div>
    </div>
  );
};

export default Collapse;
