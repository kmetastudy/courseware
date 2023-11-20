export const axiosManager = (function () {
  let accessToken = null;
  let csrfToken = null;

  axios.interceptors.response.use(
    (response) => {
      if (response?.headers?.authorization) {
        const newAccessToken = response.headers.authorization;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        accessToken = newAccessToken;
        console.log("access token applied: ", newAccessToken);
      }
      return response;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  return {
    setAccessToken: function (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      accessToken = token;
      console.log("access token applied: ", token);
    },
    setCsrfToken: function (token) {
      axios.defaults.headers.common["X-CSRFTOKEN"] = token;
      csrfToken = token;
      console.log("csarf token applied: ", token);
    },
  };
})();
