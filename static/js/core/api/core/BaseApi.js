export class BaseApi {
  /**
   * BaseApi
   * @param {URL} relativeUrl
   * @description BaseUrl seems like "www.localhost:8000"
   *
   * So you need to add "/" at the startpoint.
   * @example "/st/api/study_result/"
   */
  constructor(relativeUrl) {
    this.baseUrl = this.getRootUrl();
    this.relativeUrl = relativeUrl ?? "";

    this.unAllowedParams = [undefined, "", null, []];

    this.createInstance(this.baseUrl);
  }

  isValidParams(params) {
    for (const [key, value] of Object.entries(params)) {
      if (this.unAllowedParams.includes(value)) {
        return false;
      }
    }
    return true;
  }

  createInstance({ baseUrl, ...config }) {
    this.api = axios.create({
      baseUrl: baseUrl,
      ...config,
    });
  }

  getRootUrl() {
    return window.location.origin;
  }

  /**
   *
   * @param {FormData} data
   * @returns {Promise}
   */
  create(data) {
    return this.api.post(this.relativeUrl, data);
  }
  /** @type {(pk: uuid)=> Promise<{...}>} */
  get(pk) {
    return this.api.get(`${this.relativeUrl}${pk}/`);
  }
  /** @type {(param: object)=> Promise<{...}>} */
  filter(param) {
    /**
     * axios는, "", undefined, null, [] 값이 params에 있는 경우, 해당을 포함하지않는다.
     * filter의 params가 의도한것과 다르기 때문에,요청 또한 의도한 요청과 다륻 수 있다.
     * 따라서, param값 중 하나라도 유효하지 않은 경우, 빈 배열을 반환한다.
     * 만약, 전체 데이터를 받고 싶으면, list 메소드를 사용하자.
     */
    if (this.isValidParams(param) === false) {
      return { data: [] };
    }

    return this.api.get(this.relativeUrl, { params: param });
  }
  list() {
    return this.api.get(this.relativeUrl);
  }
  /** @type {(pk: uuid)=> Promise<{...}>} */
  delete(pk) {
    return this.api.delete(`${this.relativeUrl}${pk}/`);
  }
  /** @type {(pk: uuid, data: object)=> Promise<{.../}>} */
  patch({ pk, data = {}, action }) {
    if (action) {
      return this.api.patch(`${this.relativeUrl}${pk}/${action}/`, data);
    }
    return this.api.patch(`${this.relativeUrl}${pk}/`, data);
  }
}
