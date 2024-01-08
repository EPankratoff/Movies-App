import React, { Component } from 'react'
import { Layout } from 'antd'

const { Content } = Layout
import './app.css'

import MoviesApi from '../../services/movie-api'
import CardFilmList from '../CardFilmList/CardFilmList'

class App extends Component {
  moviesApi = new MoviesApi()

  constructor(props) {
    super(props)
    this.state = {
      movies: [],
    }
  }

  render() {
    // const { movies } = this.state
    return (
      <Layout className="layout">
        <Content className="content center">
          <CardFilmList />
        </Content>
      </Layout>
    )
  }
}

export default App
