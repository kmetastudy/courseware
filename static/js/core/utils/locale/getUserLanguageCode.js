import { getUserLocaleLanguage } from "./getUserLocaleLanguage";
/**
 *
 * @returns {string} 'ko'
 */
export function getUserLanguageCode() {
  let language = getUserLocaleLanguage();

  let languageCode = language;

  if (languageCode.indexOf("-") !== -1) {
    languageCode = languageCode.split("-")[0];
  }

  if (languageCode.indexOf("_") !== -1) {
    languageCode = languageCode.split("_")[0];
  }

  return languageCode;
}
