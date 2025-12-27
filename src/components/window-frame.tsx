import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import TranslateIcon from "@mui/icons-material/Translate";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import type React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const WindowFrame: React.FC<Props> = observer(({ children, title }) => {
  const handleClose = () => window.ipcRenderer.send("window-close");
  const handleMinimize = () => window.ipcRenderer.send("window-minimize");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="app-region-drag flex h-8 w-full flex-row items-center justify-between bg-gray-800 p-2">
        <div className="flex flex-row items-center gap-1">
          <TranslateIcon className="h-5 w-5 text-blue-100" />
          <Typography className="select-none text-blue-100">{`Arm-translate ${title}`}</Typography>
        </div>
        <div className="app-region-no-drag flex flex-row items-center gap-4">
          <IconButton className="p-0" onClick={handleMinimize}>
            <MinimizeIcon className="h-5 w-5 text-blue-100" />
          </IconButton>
          <IconButton className="p-0" onClick={handleClose}>
            <CloseIcon className="h-5 w-5 text-blue-100" />
          </IconButton>
        </div>
      </div>
      <div className="h-[calc(100%-32px)] w-full border-4 border-gray-800 border-t-0">
        {children}
      </div>
    </div>
  );
});

export default WindowFrame;
