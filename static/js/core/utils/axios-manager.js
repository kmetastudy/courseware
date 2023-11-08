// // errorComposer will compose a handleGlobally function
// const errorComposer = (error) => {
//   return () => {
//     const statusCode = error.response ? error.response.status : null;
//     if (statusCode === 404) {
//       throw new Error("The requested resource does not exist or has been deleted");
//     }

//     if (statusCode === 401) {
//       console.log("Please login to access this resource");
//       window.location.href = "../user/api/login/";
//     }
//   };
// };

// axios.interceptors.response.use(undefined, function (error) {
//   error.handleGlobally = errorComposer(error);

//   return Promise.reject(error);
// });

// axios.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// // Fetch some missing information
// axios
//   .get("/api/articles/not-found")
//   .then((resp) => {
//     // So something with article information
//   })
//   .catch((error) => {
//     const statusCode = error.response ? error.response.status : null;
//     // We will handle locally
//     // When it's a 404 error, else handle globally
//     if (statusCode === 404) {
//       // Do some specific error handling logic for this request
//       // For example: show the user a paywall to upgrade their subscription in order to view achieves
//     } else {
//       error.handleGlobally && error.handleGlobally();
//     }
//   });

// // Fetch some missing information
// axios
//   .get("/api/users/not-found")
//   .then((resp) => {
//     // So something with user information
//   })
//   .catch((error) => {
//     // We want to handle globally
//     error.handleGlobally && error.handleGlobally();
//   });

// ////////////////////////////////////////////////////////////////////////////////

// export const ApiClient = () => {
//   // Create a new axios instance
//   const api = axios.create({
//     baseURL: "URL",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//     },
//   });

//   // Add a request interceptor to add the JWT token to the authorization header
//   api.interceptors.request.use(
//     (config) => {
//       const token = sessionStorage.getItem("jwtToken");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

//   // Add a response interceptor to refresh the JWT token if it's expired
//   api.interceptors.response.use(
//     (response) => {
//       //
//       return response;
//     },
//     (error) => {
//       const originalRequest = error.config;

//       // If the error is a 401 and we have a refresh token, refresh the JWT token
//       if (error.response.status === 401 && sessionStorage.getItem("refreshToken")) {
//         const refreshToken = sessionStorage.getItem("refreshToken");

//         let data = JSON.stringify({
//           refresh_token: refreshToken,
//         });

//         post("/refreshToken", data)
//           .then((response) => {
//             sessionStorage.setItem("jwtToken", response.token);
//             sessionStorage.setItem("refreshToken", response.refresh_token);

//             // Re-run the original request that was intercepted
//             originalRequest.headers.Authorization = `Bearer ${response.token}`;
//             api(originalRequest)
//               .then((response) => {
//                 return response.data;
//               })
//               .catch((error) => {
//                 console.log(error);
//               });
//             // return api(originalRequest)
//           })
//           .catch((err) => {
//             // If there is an error refreshing the token, log out the user
//             console.log(err);
//           });
//       }

//       // Return the original error if we can't handle it
//       return Promise.reject(error);
//     },
//   );

//   const login = (email, password) => {
//     return api
//       .post("/authentication_token", { email, password })
//       .then(({ data }) => {
//         // Store the JWT and refresh tokens in session storage
//         sessionStorage.setItem("jwtToken", data.token);
//         sessionStorage.setItem("refreshToken", data.refresh_token);
//       })
//       .catch((err) => {
//         // Return the error if the request fails
//         return err;
//       });
//   };

//   const get = (path) => {
//     return api.get(path).then((response) => response.data);
//   };

//   const post = (path, data) => {
//     return api.post(path, data).then((response) => response.data);
//   };

//   const put = (path, data) => {
//     return api.put(path, data).then((response) => response.data);
//   };

//   const del = (path) => {
//     return api.delete(path).then((response) => response);
//   };

//   return {
//     login,
//     get,
//     post,
//     put,
//     del,
//   };
// };
