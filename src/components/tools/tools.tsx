import { observer } from "mobx-react-lite";
import React from "react";
import appModel from "../../app-model";
import Button from "../basic/button";
import Spinner from "../basic/spinner";
import ToolsOptions from "./tools-options";

const Tools = observer(() => {
  const [open, setOpen] = React.useState(false);
  const { targetLang, sourceLang, captureAndTranslate, autoCapture, loading } =
    appModel;

  const isMissingValue = !(sourceLang && targetLang);

  React.useEffect(() => {
    window.ipcRenderer.on("global-shortcut-pressed", () => {
      captureAndTranslate();
    });
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row items-center gap-4">
        <Button
          label={`${open ? "▲" : "▼"} Options`}
          onClick={() => setOpen(!open)}
          variant="text"
        />
        <Button
          disabled={isMissingValue || autoCapture}
          label="Capture"
          onClick={captureAndTranslate}
        />
        {isMissingValue ? (
          <p className="text-red-500 text-sm">Select target/source lang</p>
        ) : null}
        {loading ? <Spinner className="text-blue-100" /> : null}
      </div>
      <ToolsOptions open={open} />
    </div>
  );
});

export default Tools;
