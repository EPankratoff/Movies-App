import React, { Component } from 'react'
import { Layout } from 'antd'

import './app.css'
import MoviesApi from '../../services/movie.service'
import CardFilmList from '../CardFilmList/CardFilmList'

const { Content } = Layout

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
    }
    this.moviesApi = new MoviesApi()
  }

  componentDidMount() {
    this.moviesApi.getMovies().then((moviesData) => {
      this.setState({
        movies: moviesData.results,
      })
    })
  }

  render() {
    const { movies } = this.state
    return (
      <Layout className="layout">
        <Content className="content center">
          <CardFilmList movies={movies} />
        </Content>
      </Layout>
    )
  }
}

export default App
