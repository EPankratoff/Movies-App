import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Layout, Alert, Space, Tabs } from 'antd'

import './app.css'
import MoviesApi from '../../services/movie.service'
import SearchTab from '../SearchTab/SearchTab'
import { MoviesProvider } from '../MoviesContext/MoviesContext'
import RatedTab from '../RatedTab/RatedTab'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      currentPage: 1,
      totalPages: 1,
      error: false,
      searchQuery: '',
      totalSearchPages: 1,
      guestSessionId: '',
      ratedMovies: [],
      ratedFilms: [],
      ratedList: [],
      ratedTotalPages: 1,
      currentPageRated: 1,
      currentSearchInput: 'return',
      genres: [],
      activeTab: '1',
    }
    this.moviesApi = new MoviesApi()

    this.loadRatedMovies = this.loadRatedMovies.bind(this)
    this.createGuest = this.createGuest.bind(this)
    this.getMovieList = this.getMovieList.bind(this)
    // this.fetchMovies = this.fetchMovies.bind(this)
  }

  componentDidMount() {
    this.createGuest()
    this.getMovieList('return', 1)
    this.loadGenres()
  }

  async loadRatedMovies(sessionId, page) {
    try {
      console.log('Loading rated movies for session:', sessionId, 'page:', page)

      const ratedMoviesResponse = await this.moviesApi.getRatingList(sessionId, page)
      if (ratedMoviesResponse.results) {
        console.log('Rated Movies Response:', ratedMoviesResponse.results)
      } else {
        console.error('Ответ API не содержит необходимых данных:', ratedMoviesResponse.results)
      }

      const ratedMovies = ratedMoviesResponse.results || []

      const updatedMovies = [
        ...ratedMovies.map((ratedMovie) => ({
          id: ratedMovie.id,
          title: ratedMovie.title || 'Unknown Title',
          rating: ratedMovie.rating,
          overview: ratedMovie.overview,
          poster_path: ratedMovie.poster_path,
          genre_ids: ratedMovie.genre_ids,
          vote_average: ratedMovie.vote_average,
          release_date: ratedMovie.release_date,
        })),
      ]

      const ratedTotalPages = ratedMoviesResponse.total_pages
      this.setState({
        ratedMovies: updatedMovies,
        ratedTotalPages,
        ratedCurrentPage: page,
      })
    } catch (error) {
      console.error('Ошибка загрузки рейтинговых фильмов:', error)
    }
  }

  createGuest() {
    this.moviesApi
      .createGuestSession()
      .then((result) => {
        console.log('Гостевая сессия создана:', result.guest_session_id)
        this.setState({
          guestSessionId: result.guest_session_id,
        })
      })
      .catch(this.onError)
  }

  loadGenres = async () => {
    const moviesApi = new MoviesApi()

    try {
      const genreList = await moviesApi.getGenreList()
      this.setState({ genres: genreList })
    } catch (error) {
      console.error('Error loading genre list:', error)
    }
  }

  getMovieList(key, page) {
    this.setState({
      loading: true,
      currentSearchInput: key,
    })
    this.moviesApi
      .getByKeyword(key, page)
      .then((result) => {
        if (result.length === 0) {
          throw new Error('Не найдено')
        }
        this.setState({
          movies: result,
          loading: false,
          errorSearch: false,
          currentPage: page,
          totalSearchPages: result.total_results,
        })
      })
      .catch(this.onError)
  }

  // fetchMovies = (page) => {
  //   this.moviesApi
  //     .getMovies(page)
  //     .then((moviesData) => {
  //       this.onMovieLoaded(moviesData.results, moviesData.total_pages)
  //     })
  //     .catch(this.onError)
  // }

  handleSearch = (query) => {
    if (query.trim() === '') {
      return
    }

    this.setState({
      loading: true,
      error: false,
      noResults: false,
      currentPage: 1,
      searchQuery: query,
    })

    this.moviesApi
      .searchMovies(query, 1)
      .then((moviesData) => {
        if (moviesData.results.length === 0) {
          this.setState({
            noResults: true,
          })
        } else {
          this.setState({
            noResults: false,
            totalSearchPages: moviesData.total_pages,
          })
        }
        this.onMovieLoaded(moviesData.results, moviesData.total_pages)
      })
      .catch(this.onError)
  }
  handlePageChange = (page) => {
    this.setState({
      currentPage: page,
      loading: true,
    })

    this.getMovieList(this.state.searchQuery, page)
  }

  handlePageChangeRated = (page) => {
    this.setState({
      currentPageRated: page,
      loading: true,
    })

    this.loadRatedMovies(this.state.guestSessionId, page)
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  onMovieLoaded = (movies, total_pages) => {
    const totalPages = Number(total_pages)
    this.setState({
      movies,
      loading: false,
      totalPages,
    })
  }

  postRating = (movieId, value) => {
    const { guestSessionId } = this.state

    this.moviesApi.postRating(guestSessionId, movieId, value).then(() => {
      this.setState(({ ratedMovies }) => {
        const newRatedMovies = [...ratedMovies]
        const ratedIdx = newRatedMovies.findIndex((object) => object.id === movieId)

        if (ratedIdx >= 0) {
          newRatedMovies[ratedIdx].value = value
          return {
            ratedMovies: newRatedMovies,
          }
        }

        newRatedMovies.push({ id: movieId, value })
        return {
          ratedMovies: newRatedMovies,
        }
      })
    })
  }

  deleteRating = (movieId) => {
    const { guestSessionId } = this.state

    this.moviesApi.deleteRating(guestSessionId, movieId).then(() => {
      this.setState(({ ratedMovies }) => {
        const newRatedMovies = [...ratedMovies]
        const ratedIdx = newRatedMovies.findIndex((object) => object.id === movieId)

        if (ratedIdx >= 0) {
          newRatedMovies[ratedIdx].value = 0
          return {
            ratedMovies: newRatedMovies,
          }
        }

        return {
          ratedMovies: newRatedMovies,
        }
      })
    })
  }

  updateSearchQuery = (value) => {
    this.setState({ searchQuery: value })
  }

  render() {
    const {
      movies,
      loading,
      error,
      currentPage,
      totalPages,
      noResults,
      ratedMovies,
      ratedTotalPages,
      guestSessionId,
      ratedFilms,
      ratedList,
      genres,
      currentPageRated,
      activeTab,
      searchQuery,
    } = this.state

    let contentComponent

    if (activeTab === '1') {
      // Вкладка "Search"
      contentComponent = (
        <SearchTab
          movies={movies}
          loading={loading}
          error={error}
          noResults={noResults}
          onSearch={this.handleSearch}
          onChange={this.handlePageChange}
          current={currentPage}
          total={totalPages}
          onPostRating={this.postRating}
          onDeleteRating={this.deleteRating}
          searchQuery={searchQuery}
          onInputChange={this.updateSearchQuery}
        />
      )
    } else if (activeTab === '2') {
      // Вкладка "Rated"
      contentComponent = (
        <RatedTab
          guestSessionId={guestSessionId}
          ratedMovies={ratedMovies}
          ratedFilms={ratedFilms}
          ratedList={ratedList}
          onChange={this.handlePageChangeRated}
          ratedTotalPages={ratedTotalPages}
          loadRatedMovies={this.loadRatedMovies}
          currentPageRated={currentPageRated}
          onPostRating={this.postRating}
          onDeleteRating={this.deleteRating}
        />
      )
    }

    return (
      <MoviesProvider
        value={{
          genres,
          guestSessionId,
        }}
      >
        <Online>
          <Layout className="layout">
            <Tabs
              defaultActiveKey="1"
              centered
              activeKey={activeTab}
              onChange={(key) => this.setState({ activeTab: key })}
            >
              <Tabs.TabPane tab="Search" key="1">
                {contentComponent}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Rated" key="2">
                {contentComponent}
              </Tabs.TabPane>
            </Tabs>
          </Layout>
        </Online>
        <Offline>
          <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
          >
            <Alert
              message="Проблема с подключением"
              description="Проверьте доступ к интернету!"
              type="error"
              showIcon
            />
          </Space>
        </Offline>
      </MoviesProvider>
    )
  }
}

export default App
