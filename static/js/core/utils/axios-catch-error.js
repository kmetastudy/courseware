export const axiosCatchError = function (err) {
  if (err.response && err.response.data.message) {
    console.log(err.response.data.message);
  } else if (err.response) {
    console.log(err.response);
  } else if (err.request) {
    console.log(err.request);
  } else {
    console.log(err.message);
  }
};
