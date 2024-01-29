/* eslint-disable no-unused-vars */
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
    }
    this.moviesApi = new MoviesApi()
  }

  componentDidMount() {
    this.createGuest()
    this.fetchMovies()
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
        ...this.state.ratedFilms,
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
        this.setState(
          {
            guestSessionId: result.guest_session_id,
          }
          // () => {
          //   if (this.state.ratedMovies.length > 0) {
          //     this.loadRatedMovies(result.guest_session_id, this.state.ratedCurrentPage)
          //   }
          // }
        )
      })
      .catch(this.onError)
  }

  // getRatedList(page) {
  //   const { guestSessionId } = this.state

  //   this.setState({
  //     loading: true,
  //   })

  //   this.moviesApi
  //     .getRatingList(guestSessionId, page)
  //     .then((result) => {
  //       if (result.results.length === 0) {
  //         this.setState({
  //           ratedList: result.results,
  //         })
  //       }
  //       this.setState({
  //         ratedList: result.results,
  //         loading: false,
  //         error: false,
  //         ratedTotalPages: result.total_results,
  //         currentPageRated: page,
  //       })
  //     })
  //     .catch(this.onError)
  // }

  fetchMovies = (page) => {
    this.moviesApi
      .getMovies(page)
      .then((moviesData) => {
        this.onMovieLoaded(moviesData.results, moviesData.total_pages)
      })
      .catch(this.onError)
  }

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
      .searchMovies(query, this.state.currentPage)
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
      totalPages: this.state.totalSearchPages,
    })

    this.fetchMovies(page)
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  onMovieLoaded = (movies, total_pages) => {
    this.setState({
      movies,
      loading: false,
      totalPages: total_pages,
    })
  }

  postRating = (movieId, value) => {
    const { guestSessionId } = this.state

    this.moviesApi.postRating(guestSessionId, movieId, value).then(() => {
      this.setState(({ ratedFilms }) => {
        const newRatedMovies = [...ratedFilms]
        const ratedIdx = newRatedMovies.findIndex((object) => object.id === movieId)

        if (ratedIdx >= 0) {
          newRatedMovies[ratedIdx].value = value
          return {
            ratedFilms: newRatedMovies,
          }
        }

        newRatedMovies.push({ id: movieId, value })
        return {
          ratedFilms: newRatedMovies,
        }
      })
    })
  }

  deleteRating = (movieId) => {
    const { guestSessionId } = this.state

    this.moviesApi.deleteRating(guestSessionId, movieId).then(() => {
      this.setState(({ ratedFilms }) => {
        const newRatedMovies = [...ratedFilms]
        const ratedIdx = newRatedMovies.findIndex((object) => object.id === movieId)

        if (ratedIdx >= 0) {
          newRatedMovies[ratedIdx].value = 0
          return {
            ratedFilms: newRatedMovies,
          }
        }

        return {
          ratedFilms: newRatedMovies,
        }
      })
    })
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
      currentPageRated,
    } = this.state

    return (
      <MoviesProvider>
        <Online>
          <Layout className="layout">
            <Tabs defaultActiveKey="1" centered>
              <Tabs.TabPane tab="Search" key="1">
                <SearchTab
                  movies={movies}
                  loading={loading}
                  error={error}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  noResults={noResults}
                  onSearch={this.handleSearch}
                  onChange={this.handlePageChange}
                  current={currentPage}
                  total={totalPages}
                  onPostRating={this.postRating}
                  onDeleteRating={this.deleteRating}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="Rated" key="2">
                <RatedTab
                  guestSessionId={guestSessionId}
                  ratedMovies={ratedMovies}
                  ratedFilms={ratedFilms}
                  ratedList={ratedList}
                  ratedTotalPages={ratedTotalPages}
                  loadRatedMovies={() => this.loadRatedMovies(guestSessionId, currentPage)}
                />
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
