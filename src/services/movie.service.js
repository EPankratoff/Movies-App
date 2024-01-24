export default class MoviesApi {
  _apiBase = 'https://api.themoviedb.org/3'
  _apikey = '42228cc1d5c40501f5230e1b1183c153'

  async getResource(url, page = 1, params = {}) {
    const queryParams = new URLSearchParams({
      api_key: this._apikey,
      page: page,
      ...params,
    })

    const response = await fetch(`${this._apiBase}${url}?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  async fetchJSON(url, options = {}) {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса ${url}`)
    }

    return await response.json()
  }

  async createGuestSession() {
    const url = `${this._apiBase}/authentication/guest_session/new?api_key=${this._apikey}`
    const data = await this.fetchJSON(url)
    return data.guest_session_id
  }

  getMovies(page = 1) {
    return this.getResource('/discover/movie', page)
  }

  async getGenreList() {
    try {
      const data = await this.getResource('/genre/movie/list', 1, { language: 'en' })
      return data.genres
    } catch (error) {
      console.error('Error fetching genre list:', error)
      throw error
    }
  }

  searchMovies(query, page = 1) {
    return this.getResource('/search/movie', page, { query })
  }
}
