import { makeAutoObservable } from 'mobx'
import {
  tesseractLanguageCodeMap,
  type SourceLanguageCodeType,
  type TargetLanguageCodeType,
} from './Language'
import Tesseract from 'tesseract.js'

type AppConfig = {
  DEEPL_API_KEY: string
}

export class AppModel {
  targetLang: { code: TargetLanguageCodeType; label: string } | null = {
    code: 'ru',
    label: 'Russian',
  }

  sourceLang: { code: SourceLanguageCodeType; label: string } | null = {
    code: 'en',
    label: 'English',
  }

  textTranslate: string | undefined = undefined

  textSize: number = 2

  autoCapture: boolean = false

  hotkey: string = ''

  config: AppConfig = { DEEPL_API_KEY: '' }

  constructor() {
    makeAutoObservable(this)
  }

  captureAndTranslate = async () => {
    if (!this.sourceLang || !this.targetLang || this.autoCapture) return
    const image = await window.ipcRenderer.invoke('take-screenshot')
    const captureText = await this.capture(image)
    const translateText = await this.translate(captureText)
    appModel.textTranslate = translateText
  }

  capture = async (image: Buffer<ArrayBufferLike>) => {
    if (!this.sourceLang) return ''
    const search = await Tesseract.recognize(image, tesseractLanguageCodeMap[this.sourceLang.code])
    return this.fixCaptureText(search.data.text)
  }

  translate = async (text: string) => {
    try {
      const body = {
        text,
        target_lang: this.targetLang?.code || '',
        source_lang: this.sourceLang?.code || '',
        model_type: 'prefer_quality_optimized',
        formality: 'prefer_less',
      }
      const res = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${this.config.DEEPL_API_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(body).toString(),
      })
      const data: { translations: { text: string }[] } = await res.json()
      return data.translations[0].text
    } catch (e) {
      console.error(e)
    }
  }

  initConfig = async () => {
    const config = await window.ipcRenderer.invoke('get-config')
    this.config = config
  }

  fixCaptureText = (text: string) => {
    return text.replaceAll('|', 'I')
  }
}

const appModel = new AppModel()

export default appModel
