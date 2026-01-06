import { makeAutoObservable } from "mobx";
import Tesseract from "tesseract.js";
import {
  type SourceLanguageCodeType,
  type TargetLanguageCodeType,
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

  targetLang: TargetLanguageCodeType | undefined = undefined;

  sourceLang: SourceLanguageCodeType | undefined = undefined;

  textInput: string | undefined = undefined;

  textOutput: string | undefined = undefined;

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

    try {
      const image = await window.ipcRenderer.invoke("take-screenshot");

      const captureText = await this.capture(image);
      this.textInput = captureText;

      const translateText = await this.translate(captureText);
      this.textOutput = translateText;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  };

  capture = async (image: Buffer<ArrayBufferLike>) => {
    if (!this.sourceLang) {
      return "";
    }

    const search = await Tesseract.recognize(
      image,
      tesseractLanguageCodeMap[this.sourceLang]
    );

    return this.fixCaptureText(search.data.text);
  };

  translate = async (text: string) => {
    try {
      const body = {
        text,
        target_lang: this.targetLang || "",
        source_lang: this.sourceLang || "",
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

    this.sourceLang = config.SOURCE_LANG ?? null;
    this.targetLang = config.TARGET_LANG ?? null;
  };

  fixCaptureText = (text: string) => {
    return text.replaceAll("|", "I");
  };
}

const appModel = new AppModel();

export default appModel;
