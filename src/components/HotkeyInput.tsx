import React from "react";
import { observer } from "mobx-react-lite";
import appModel from "../AppModel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from "@mui/material/InputAdornment";

const HotkeyInput: React.FC = observer(() => {
  const [recording, setRecording] = React.useState(false);
  const [error, setError] = React.useState(false);
  let modifiers: string[] = [];

  const toggleRecord = () => {
    setError(false);
    setRecording(!recording);
  };

  const handleRemoveHotkey = async () => {
    setError(false);
    await window.ipcRenderer.invoke('globalShortcut-unregister');
    appModel.hotkey = '';
  };

  const codeFormat = (code: string) => {
    if (code.startsWith('KEY')) {
      return code.substring(3);
    }
    if (code.startsWith('DIGIT')) {
      return code.substring(5);
    }
    if (code.endsWith('LEFT')) {
      return code.substring(0, code.length - 4);
    }
    if (code.endsWith('RIGHT')) {
      return code.substring(0, code.length - 5);
    }
    return code;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const code = codeFormat(event.code.toUpperCase());

    if (!modifiers.includes(code)) {
      modifiers.push(code);
    }

    const formattedHotkey = modifiers
      .sort((a, b) => {
        const order = ['COMMANDORCONTROL', 'CONTROL', 'SHIFT', 'ALT', 'SPACE'];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.localeCompare(b);
      })
      .join('+');

    appModel.hotkey = formattedHotkey;
  };

  const handleKeyUp = async () => {
    if (modifiers.length >= 2) {
      await window.ipcRenderer.invoke('globalShortcut-register', appModel.hotkey);
    } else {
      setError(true);
    }
    modifiers = [];
    setRecording(false);
  };

  React.useEffect(() => {
    if (!recording) return;
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [recording]);

  return (
    <div className="flex flex-row gap-2 w-full items-center">
      <TextField
        value={appModel.hotkey}
        size="small"
        label="Capture hotkey"
        fullWidth
        error={error}
        helperText={error ? 'The hotkey must contain at least 2 values.' : undefined}
        focused
        sx={{
          "& .MuiOutlinedInput-root": {
            position: 'relative',
            border: "1px solid",
            borderColor: error ? '#fb2c36' : '#dbeafe',
            color: '#dbeafe',
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: 'none',
          },
        }}
        slotProps={{
          input: {
            readOnly: true,
            className: 'cursor-default',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size='small' className="group" onClick={handleRemoveHotkey} disabled={appModel.hotkey === ''}>
                  <CloseIcon className="w-5 h-5 text-blue-100 group-disabled:text-gray-700" />
                </IconButton>
              </InputAdornment>
            ),
          },
          inputLabel: { className: `${error ? 'text-red-500' : 'text-blue-100'} text-lg bg-gray-800` },
          formHelperText: { className: 'text-red-500 absolute bottom-[-22px] left-0 w-full m-0' }
        }}
      />
      <Button
        onClick={toggleRecord}
        variant="contained"
        size='small'
        className={`${recording ? 'bg-blue-300' : 'bg-blue-100'} text-gray-800 hover:bg-blue-300 min-w-[120px]`}
      >
        Set hotkey
      </Button>
    </div>
  );
});

export default HotkeyInput;
