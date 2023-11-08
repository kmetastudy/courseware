export class ApiUser {
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
}
