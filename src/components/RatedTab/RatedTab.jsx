import React, { Component } from 'react'
import { Pagination, Layout, Alert } from 'antd'

import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'

const { Content } = Layout

class RatedTab extends Component {
  async componentDidMount() {
    this.props.loadRatedMovies()
  }

  render() {
    const { ratedMovies, currentPage, ratedTotalPages, handlePageChange, guestSessionId, loading, error } = this.props

    if (loading) {
      return <Spinner className="spinner" />
    }

    if (error) {
      return <ErrorMovies />
    }

    if (!ratedMovies || !ratedMovies.results || ratedMovies.results.length === 0) {
      return <Alert message="Нет оцененных фильмов." description="Пожалуйста, оцените фильмы." type="info" />
    }

    return (
      <div>
        <Content className="content center">
          <CardFilmList guestSessionId={guestSessionId} movies={ratedMovies.results} />
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              total={ratedTotalPages}
              onChange={(page) => handlePageChange(page)}
              showSizeChanger={false}
            />
          </div>
        </Content>
      </div>
    )
  }
}

export default RatedTab
