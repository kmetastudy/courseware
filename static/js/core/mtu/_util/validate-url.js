function testWithRegex(str) {
  /* reference from https://stackoverflow.com/a/54620350/14344959*/
  const absoluteRegex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}" + // domain name
      "|((\\d{1,3}\\.){3}\\d{1,3})" + // OR IP (v4) address
      "|localhost)" + // OR localhost
      // '(\\:\\d+) + // port (one or more digits)
      "(\\:\\d{1,5})?" + // port (digits limit 1 to 5)
      // '(\\/[-a-z\\d%_.~+]*)*'+ // path
      "(\\/[a-zA-Z\\&\\d%_.~+-:@]*)*" + // path
      // '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      "(\\?[a-zA-Z\\&\\d%_.,~+-:@=;&]*)?" + // query string
      // '(\\#[-a-z\\d_]*)?$', // fragment locator
      "(\\#[-a-zA-Z&\\d_]*)?$", // fragment locator
  );

  const relativeRegex = new RegExp("/^(https?://)?([da-z.-]+).([a-z.]{2,6})([/w .-]*)*/?$|^/|^./|^../|^#w+/;");

  return absoluteRegex.test(str) || relativeRegex.test(str);
}

function testWithUrlClass(urlStr) {
  try {
    new URL(urlStr);
    return true;
  } catch (e) {
    return false;
  }
}

export const validateUrl = function (url) {
  return testWithUrlClass(url) || testWithRegex(url);
};
