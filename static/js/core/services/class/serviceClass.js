/** @param {uuid} classId */
export function getClass(classId) {
  api.class
    .get(classId)
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((error) => {
      if (err.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      console.log(error.config);
    });
}

/** @param {uuid} userId */
export function filterClassWithOwnerId(userId) {
  api.class
    .filter({ id_owner: userId })
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((error) => {
      if (err.response) {
        console.log(error.response);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
      console.log(error.config);
    });
}
