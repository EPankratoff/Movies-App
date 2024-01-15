export default class MoviesApi {
  _apiBase = 'https://api.themoviedb.org/3'
  _apikey = '42228cc1d5c40501f5230e1b1183c153'

  _apiOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MjIyOGNjMWQ1YzQwNTAxZjUyMzBlMWIxMTgzYzE1MyIsInN1YiI6IjY1OWMwNzI5ODliNTYxMzY5MWZjNjU1YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RMtb4C-R6Q75jAhPJ9jDwseyTrXD_z7IIO5eFUfVnaI',
    },
  }

  async getResource(url, page = 1) {
    const response = await fetch(`${this._apiBase}${url}?api_key=${this._apikey}&page=${page}`, this._apiOptions)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return await response.json()
  }

  getMovies(page = 1) {
    return this.getResource('/discover/movie', page)
  }

  async getGenreList() {
    try {
      const data = await this.getResource('/genre/movie/list?language=en')
      return data.genres
    } catch (error) {
      console.error('Error fetching genre list:', error)
      throw error
    }
  }

  searchMovies(query, page = 1) {
    return this.getResource(`/search/movie?query=${query}`, page)
  }
}
