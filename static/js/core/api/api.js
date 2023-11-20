export class API {
  /**
   *
   * @param {*} endpoint model's name (course_book, testum_unit, ...)
   */
  constructor() {}

  post(endpoint, data) {
    console.log(data);
    const form = new FormData();
    for (let [key, value] of Object.entries(data)) {
      console.log(key, value);
      form.append(key, value);
    }
    return axios
      .post(endpoint, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }

  get(endpoint) {
    //api/_cp/course_book/some_id/
    return axios
      .get(endpoint)
      .then((res) => {
        if (res.data) {
          return res.data;
          // if get all-> array of data object [{},{}]
          // if get -> one object of data {}
        }
      })
      .catch((err) => console.error(err));
  }

  filter(endpoint, params) {
    //api/cp/course_book/id/
    // params: {title: '중3-1'}
    return axios
      .get(endpoint, {
        params: params,
      })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }

  update({ endpoint, data }) {
    const result = axios.patch(endpoint, data).then((res) => {
      if (res.data) {
        return result;
      }
    });
  }

  remove(endpoint) {
    const result = axios.delete(endpoint).then((res) => {
      if (res.data) {
        return res.data;
      }
    });
  }

  // TODO
  // 원래 이렇게 하면 안되는데..
  // 일단 급하니 이렇게 하고, 나중에 수정하자.
  getJsonField(courseId, param) {
    const url = `${endpoint}${courseId}/get_json_field/`;
    return axios
      .get(url, {
        params: param,
      })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }
}
