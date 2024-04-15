/**
 * utc 시간을 local 시간으로 변환
 * @requires dayjs
 * @requires dayjs/locale/ko
 * @requires dayjs/plugin/utc
 * @requires dayjs/plugin/timezone
 * @param {*} isoString
 * @param {*} format
 * @returns
 */
export function utcToLocalString(isoString, format = "YYYY-MM-DD") {
  return dayjs.utc(isoString).local().format(format);
}
