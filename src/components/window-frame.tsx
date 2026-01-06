import type React from "react";
import IconButton from "./basic/icon-button";
import CloseIcon from "./icons/close-icon";
import MinimizeIcon from "./icons/minimize-icon";
import TranslateIcon from "./icons/translate-icon";

interface IWindowFrame {
  title: string;
  children: React.ReactNode;
}

const WindowFrame = ({ children, title }: IWindowFrame) => {
  const handleClose = () => window.ipcRenderer.send("window-close");
  const handleMinimize = () => window.ipcRenderer.send("window-minimize");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="app-region-drag flex h-8 w-full flex-row items-center justify-between bg-gray-800 p-2">
        <div className="flex flex-row items-center gap-1">
          <TranslateIcon className="h-5 w-5 text-blue-100" />
          <p className="select-none text-blue-100">{`Arm-translate ${title}`}</p>
        </div>
        <div className="app-region-no-drag flex flex-row items-center gap-1">
          <IconButton onClick={handleMinimize}>
            <MinimizeIcon />
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
      <div className="h-[calc(100%-32px)] w-full border-4 border-gray-800 border-t-0">
        {children}
      </div>
    </div>
  );
};

export default WindowFrame;
