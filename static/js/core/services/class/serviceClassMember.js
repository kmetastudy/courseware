export function filterWithClassId(classId) {
  api.class
    .filter({ id_class: classId })
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

export function filterWithUserId(userId) {
  api.class
    .filter({ id_user: userId })
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
