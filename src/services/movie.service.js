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

    return response.json()
  }

  async fetchJSON(url, options = {}) {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Ошибка при выполнении запроса ${url}`)
    }

    return await response.json()
  }

  async createGuestSession() {
    const response = await this.fetchJSON(`${this._apiBase}/authentication/guest_session/new?api_key=${this._apikey}`)
    return response
  }

  async getRatingList(guestSessionId, page) {
    try {
      const response = await this.fetchJSON(
        `${this._apiBase}/guest_session/${guestSessionId}/rated/movies?page=${page}&api_key=${this._apikey}`
      )

      console.log('Rated Movies Response:', response)

      return response
    } catch (error) {
      console.error('Error fetching rated movies:', error)
      throw error
    }
  }

  async postRating(sessionId, movieId, rating) {
    const url = `${this._apiBase}/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${this._apikey}`
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    }

    try {
      await this.fetchJSON(url, options)
    } catch (error) {
      console.error('Ошибка при отправке рейтинга:', error)
      throw error
    }
  }

  async deleteRating(sessionId, movieId) {
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${this._apikey}`,
      options
    )
    return response.json()
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
