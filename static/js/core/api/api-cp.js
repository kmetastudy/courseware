export class ApiCp {
  /**
   *
   * @param {*} endpoint model's name (course_book, testum_unit, ...)
   */
  constructor(appname, endpoint) {
    this.appname = appname;
    this.endpoint = endpoint;
    this.baseURL = `../${appname}/api/${endpoint}/`;
  }

  create(data) {
    return axios
      .post(this.baseURL, data)
      .then((res) => {
        if (res.data.results) {
          return res.data.results;
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

  // #setCondition(conditions) {
  //   for (let key in conditions) {
  //     // params[key]
  //   }
  //   return params;
  // }
}
