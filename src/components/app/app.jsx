import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Layout, Alert, Space, Pagination } from 'antd'

import './app.css'
import MoviesApi from '../../services/movie.service'
import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'
import SearchFilm from '../SearchFilm/SearchFilm'

const { Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      currentPage: 1,
      totalPages: 1,
      error: false,
    }
    this.moviesApi = new MoviesApi()
  }

  componentDidMount() {
    this.fetchMovies(this.state.currentPage)
  }

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
    })

    this.moviesApi
      .searchMovies(query)
      .then((moviesData) => {
        console.log('Movies data:', moviesData)
        if (moviesData.results.length === 0) {
          this.setState({
            noResults: true,
          })
        } else {
          this.setState({
            noResults: false,
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

  render() {
    const { movies, loading, error, currentPage, totalPages, noResults } = this.state
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorMovies /> : null
    const spinner = loading ? <Spinner className="spinner" /> : null
    const content = hasData ? <CardFilmList movies={movies} loading={loading} /> : null
    const noResultsMessage = noResults ? (
      <Alert message="Нет результатов." description="Поробуйте изменить свой запрос по поиску фильмов" type="info" />
    ) : null

    return (
      <>
        <Online>
          <Layout className="layout">
            <Content className="content center">
              <SearchFilm onSearch={this.handleSearch} />
              {errorMessage}
              {content}
            </Content>
            {noResultsMessage}

            {spinner}
            <Pagination
              onChange={this.handlePageChange}
              current={currentPage}
              total={totalPages}
              showSizeChanger={false}
            />
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
      </>
    )
  }
}

export default App
