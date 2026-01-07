import { observer } from "mobx-react-lite";
import React from "react";
import appModel from "../../app-model";
import Button from "../basic/button";
import IconButton from "../basic/icon-button";
import Input from "../basic/input";
import CloseIcon from "../icons/close-icon";

const HotkeyInput = observer(() => {
  const [recording, setRecording] = React.useState(false);
  const [error, setError] = React.useState(false);
  let modifiers: string[] = [];

  const toggleRecord = () => {
    setError(false);
    setRecording(!recording);
  };

  const handleRemoveHotkey = async () => {
    setError(false);
    await appModel.updateConfig({ HOTKEY: null });
    appModel.hotkey = "";
  };

  const codeFormat = (code: string) => {
    if (code.startsWith("KEY")) {
      return code.substring(3);
    }
    if (code.startsWith("DIGIT")) {
      return code.substring(5);
    }
    if (code.endsWith("LEFT")) {
      return code.substring(0, code.length - 4);
    }
    if (code.endsWith("RIGHT")) {
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
        const order = ["COMMANDORCONTROL", "CONTROL", "SHIFT", "ALT", "SPACE"];
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) {
          return -1;
        }
        if (bIndex !== -1) {
          return 1;
        }
        return a.localeCompare(b);
      })
      .join("+");
    appModel.hotkey = formattedHotkey;
  };

  const handleKeyUp = async () => {
    if (modifiers.length >= 2) {
      await appModel.updateConfig({ HOTKEY: appModel.hotkey });
    } else {
      setError(true);
    }
    modifiers = [];
    setRecording(false);
  };

  React.useEffect(() => {
    if (!recording) {
      return;
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [recording]);

  return (
    <div className="relative flex w-full flex-row items-baseline gap-2">
      <Input error={error} label="Capture hotkey" value={appModel.hotkey} />
      <IconButton
        className="absolute top-3 right-35"
        disabled={!appModel.hotkey}
        onClick={handleRemoveHotkey}
      >
        <CloseIcon />
      </IconButton>
      {error ? (
        <p className="absolute -bottom-5 text-red-500 text-sm">
          The hotkey must contain at least 2 values.
        </p>
      ) : null}
      <Button
        className={recording ? "bg-blue-300" : "bg-blue-100"}
        label="Set hotkey"
        onClick={toggleRecord}
      />
    </div>
  );
});

export default HotkeyInput;
