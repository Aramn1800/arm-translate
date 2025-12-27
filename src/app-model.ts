import { makeAutoObservable } from "mobx";
import Tesseract from "tesseract.js";
import {
  type SourceLanguageCodeType,
  sourceLanguageOptions,
  type TargetLanguageCodeType,
  targetLanguageOptions,
  tesseractLanguageCodeMap,
} from "./language";

interface AppConfig {
  DEEPL_API_KEY: string;
  SOURCE_LANG: SourceLanguageCodeType;
  TARGET_LANG: TargetLanguageCodeType;
  HOTKEY: string;
}

export class AppModel {
  loading = false;

  autoCapture = false;

  targetLang: { code: TargetLanguageCodeType; label: string } | null = null;

  sourceLang: { code: SourceLanguageCodeType; label: string } | null = null;

  textTranslate: string | undefined = undefined;

  textSize = 2;

  hotkey = "";

  apiKey = "";

  constructor() {
    makeAutoObservable(this);
  }

  captureAndTranslate = async () => {
    if (!(this.sourceLang && this.targetLang) || this.autoCapture) {
      return;
    }
    this.loading = true;

    const image = await window.ipcRenderer.invoke("take-screenshot");
    const captureText = await this.capture(image);
    const translateText = await this.translate(captureText);
    this.textTranslate = translateText;

    this.loading = false;
  };

  capture = async (image: Buffer<ArrayBufferLike>) => {
    if (!this.sourceLang) {
      return "";
    }
    const search = await Tesseract.recognize(
      image,
      tesseractLanguageCodeMap[this.sourceLang.code]
    );
    return this.fixCaptureText(search.data.text);
  };

  translate = async (text: string) => {
    try {
      const body = {
        text,
        target_lang: this.targetLang?.code || "",
        source_lang: this.sourceLang?.code || "",
        model_type: "prefer_quality_optimized",
      };
      const res = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${this.apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(body).toString(),
      });
      const data: { translations: { text: string }[] } = await res.json();
      return data.translations[0].text;
    } catch (e) {
      console.error(e);
    }
  };

  initConfig = async () => {
    const config = (await window.ipcRenderer.invoke("get-config")) as AppConfig;

    this.apiKey = config.DEEPL_API_KEY;

    if (config.HOTKEY) {
      this.hotkey = config.HOTKEY;
      await window.ipcRenderer.invoke("globalShortcut-register", this.hotkey);
    }

    this.sourceLang =
      sourceLanguageOptions.find((o) => o.code === config.SOURCE_LANG) ?? null;

    this.targetLang =
      targetLanguageOptions.find((o) => o.code === config.TARGET_LANG) ?? null;
  };

  fixCaptureText = (text: string) => {
    return text.replaceAll("|", "I");
  };
}

const appModel = new AppModel();

export default appModel;
