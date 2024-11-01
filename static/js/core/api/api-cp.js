export class ApiCp {
  /**
   *
   * @param {*} endpoint model's name (course_book, testum_unit, ...)
   */
  constructor(appname, endpoint, baseURL) {
    this.appname = appname;
    this.endpoint = endpoint;
    this.baseURL = baseURL ?? `../${appname}/api/${endpoint}/`;
  }

  create(data) {
    return axios
      .post(this.baseURL, data)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }

  get(id = null) {
    let url = this.baseURL;
    if (id !== null) {
      url = `${this.baseURL}${id}/`; // retrieve
    }
    return axios
      .get(url)
      .then((res) => {
        if (res.data) {
          return res.data;
          // if get all-> array of data object [{},{}]
          // if get -> one object of data {}
        }
      })
      .catch((err) => console.error(err));
  }

  filter(conditions) {
    return axios
      .get(this.baseURL, {
        params: conditions,
      })
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.error(err));
  }

  update(id, data) {
    const result = axios.patch(`${this.baseURL}${id}/`, data);
    return result;
  }

  remove(id) {
    const result = axios.delete(`${this.baseURL}${id}/`);
    return result;
  }

  // TODO
  // 원래 이렇게 하면 안되는데..
  // 일단 급하니 이렇게 하고, 나중에 수정하자.
  getJsonField(courseId, param) {
    const url = `${this.baseURL}${courseId}/get_json_field/`;
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

  // #setCondition(conditions) {
  //   for (let key in conditions) {
  //     // params[key]
  //   }
  //   return params;
  // }
}
