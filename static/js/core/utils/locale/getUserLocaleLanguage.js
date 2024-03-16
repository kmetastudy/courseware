/**
 *
 * @returns {string} 'ko-KR'
 */
export function getUserLocaleLanguage() {
  let language = window.navigator.languages ? window.navigator.languages[0] : null;
  language = language || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

  return language;
}
