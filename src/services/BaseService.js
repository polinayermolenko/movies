export default class BaseService {
  constructor() {
    this.apiBase = `https://api.themoviedb.org/3/`;
    this.apiKey = `api_key=7201476bfa706101ff5b93dcaddc37e7`;
  }

  async getResponse(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();

    return body;
  }
}
