import React, { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Layout, Alert, Space } from 'antd'

import './app.css'
import MoviesApi from '../../services/movie.service'
import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'

const { Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      error: false,
    }
    this.moviesApi = new MoviesApi()
  }

  componentDidMount() {
    this.moviesApi
      .getMovies()
      .then((moviesData) => {
        this.onMovieLoaded(moviesData.results)
      })
      .catch(this.onError)
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  onMovieLoaded = (movies) => {
    this.setState({
      movies,
      loading: false,
    })
  }

  render() {
    const { movies, loading, error } = this.state
    const hasData = !(loading || error)
    const errorMessage = error ? <ErrorMovies /> : null
    const spinner = loading ? <Spinner /> : null
    const content = hasData ? <CardFilmList movies={movies} loading={loading} /> : null
    return (
      <>
        <Online>
          <Layout className="layout">
            <Content className="content center">
              {errorMessage}
              {spinner}
              {content}
            </Content>
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
