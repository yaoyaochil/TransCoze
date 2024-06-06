// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      sourceTitle: "Source",
      targetTitle: "Target",
      copy: "Copy",
      translate: "Translate",
    },
  },
  zh: {
    translation: {
      sourceTitle: "输入文字",
      targetTitle: "翻译结果",
      copy: "复制",
      translate: "翻译",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh", // 默认语言
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
