import { observer } from "mobx-react-lite";
import React from "react";
import appModel from "../../app-model";
import Checkbox from "../basic/checkbox";

const AutoCapture: React.FC = observer(() => {
  const { capture, translate, autoCapture } = appModel;

  let bufferText = "";
  let timeoutId: NodeJS.Timeout | undefined;

  const handleAutoCapture = async () => {
    const image = await window.ipcRenderer.invoke("take-screenshot");
    const captureText = await capture(image);

    if (bufferText !== captureText) {
      bufferText = captureText;
      const translateText = await translate(captureText);
      appModel.textOutput = translateText;
    }

    if (appModel.autoCapture) {
      timeoutId = setTimeout(() => {
        handleAutoCapture();
      }, 250);
    }
  };

  React.useEffect(() => {
    if (autoCapture) {
      handleAutoCapture();
    } else if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }, [autoCapture]);

  return (
    <Checkbox
      label="Auto capture (unstable)"
      onChange={(v) => {
        appModel.autoCapture = v;
      }}
      value={autoCapture}
    />
  );
});

export default AutoCapture;
