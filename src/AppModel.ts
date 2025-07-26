import { makeAutoObservable } from 'mobx';
import { tesseractLanguageCodeMap, type SourceLanguageCodeType, type TargetLanguageCodeType } from './Language';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const deeplKey = import.meta.env.VITE_DEEPL_API_KEY;
const isTestMode = import.meta.env.VITE_TEST_MODE === '1';

export class AppModel {
  targetLang: { code: TargetLanguageCodeType, label: string } | null = { code: 'ru', label: 'Russian' };

  sourceLang: { code: SourceLanguageCodeType, label: string } | null = { code: 'en', label: 'English' };

  textTranslate: string | undefined = undefined;

  textSize: number = 2;

  autoCapture: boolean = false;

  hotkey: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  captureAndTranslate = async () => {
    if (!this.sourceLang || !this.targetLang || this.autoCapture) return;
    const image = await window.ipcRenderer.invoke('take-screenshot');
    const captureText = await this.capture(image);
    const translateText = await this.translate(captureText);
    appModel.textTranslate = translateText;
  };

  capture = async (image: Buffer<ArrayBufferLike>) => {
    if (!this.sourceLang) return '';
    const search = await Tesseract.recognize(image, tesseractLanguageCodeMap[this.sourceLang.code]);
    if (isTestMode) {
      console.log('AppModel > captureText', search);
    }
    return search.data.text;
  };

  translate = async (text: string) => {
    try {
      const body = {
        text,
        target_lang: this.targetLang?.code,
        source_lang: this.sourceLang?.code,
      };
      const res = await axios.post<{ translations: { text: string }[] }>(
        'https://api-free.deepl.com/v2/translate', 
        body, 
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${deeplKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      );
      if (isTestMode) {
        console.log('AppModel > translateText', res);
      }
      return res.data.translations[0].text;
    } catch(e) {
      console.error(e);
    }
  }
}

const appModel = new AppModel();

export default appModel;
