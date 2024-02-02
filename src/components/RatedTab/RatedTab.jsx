import React, { Component } from 'react'
import { Pagination, Layout, Alert, Space } from 'antd'

import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'

const { Content } = Layout

class RatedTab extends Component {
  async componentDidMount() {
    const { loadRatedMovies, guestSessionId, currentPageRated } = this.props
    loadRatedMovies(guestSessionId, currentPageRated)
  }

  async componentDidUpdate(prevProps) {
    const { loadRatedMovies, guestSessionId, currentPageRated } = this.props

    if (currentPageRated !== prevProps.currentPageRated) {
      loadRatedMovies(guestSessionId, currentPageRated)
    }
  }

  render() {
    const {
      ratedMovies,
      ratedTotalPages,
      onChange,
      guestSessionId,
      loading,
      error,
      currentPageRated,
      onPostRating,
      onDeleteRating,
    } = this.props

    const hasData = !(loading || error)
    const spinner = loading ? <Spinner className="spinner" /> : null
    const errorMessage = error ? <ErrorMovies /> : null
    const content =
      hasData && ratedMovies && ratedMovies.length > 0 ? (
        <CardFilmList
          guestSessionId={guestSessionId}
          movies={ratedMovies}
          onPostRating={onPostRating}
          onDeleteRating={onDeleteRating}
        />
      ) : null

    const alertMessage =
      ratedMovies.length === 0 ? (
        <Space
          direction="vertical"
          style={{
            width: '100%',
          }}
        >
          <Alert message="Нет оцененных фильмов" description="Оцените фильм" type="info" />
        </Space>
      ) : null

    return (
      <div>
        <Content className="content center">
          <div className="pagination-container">
            {errorMessage}
            {alertMessage}
            {content}
            {spinner}

            <Pagination
              pageSize={1}
              current={currentPageRated}
              total={ratedTotalPages}
              onChange={onChange}
              showSizeChanger={false}
            />
          </div>
        </Content>
      </div>
    )
  }
}

export default RatedTab
