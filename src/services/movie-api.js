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

  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`)
    if (!res.ok) {
      // eslint-disable-next-line no-useless-concat
      throw new Error(`Очень плохая ошибка ${url}` + `, received ${res.status}`)
    }
    return await console.log(res.json())
  }
}

// const movis = new MoviesApi()

// movis.getResource().then((res) => {
//   console.log(res)
// })
