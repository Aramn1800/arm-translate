import React from "react";
import { observer } from "mobx-react-lite";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import Typography from "@mui/material/Typography";
import TranslateIcon from '@mui/icons-material/Translate';

type Props = {
  title: string,
  children: React.ReactNode,
}

const WindowFrame: React.FC<Props> = observer(({ children, title }) => {
  const handleClose = () => window.ipcRenderer.send('window-close');
  const handleMinimize = () => window.ipcRenderer.send('window-minimize');

  return (
    <div className='flex flex-col w-full h-full'>
      <div className="app-region-drag flex flex-row justify-between items-center w-full h-8 bg-gray-800 p-2">
        <div className="flex flex-row items-center gap-1">
          <TranslateIcon className="w-5 h-5 text-blue-100" />
          <Typography className="text-blue-100 select-none">
            {`Arm-translate ${title}`}
          </Typography>
        </div>
        <div className="app-region-no-drag flex flex-row items-center gap-4">
          <IconButton className="p-0" onClick={handleMinimize}><MinimizeIcon className="w-5 h-5 text-blue-100" /></IconButton>
          <IconButton className="p-0" onClick={handleClose}><CloseIcon className="w-5 h-5 text-blue-100" /></IconButton>
        </div>
      </div>
      <div className="w-full h-[calc(100%-32px)] border-4 border-gray-800 border-t-0">
        {children}
      </div>
    </div>
  );
});

export default WindowFrame;
