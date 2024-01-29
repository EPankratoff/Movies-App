import React, { Component } from 'react'
import { Pagination, Layout } from 'antd'

import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'

const { Content } = Layout

class RatedTab extends Component {
  // async componentDidMount() {
  //   this.props.getRatedList()
  // }

  async componentDidMount() {
    const { loadRatedMovies, currentPage } = this.props
    loadRatedMovies(currentPage)
  }

  render() {
    const { ratedMovies, currentPage, ratedTotalPages, handlePageChange, guestSessionId, loading, error } = this.props

    const hasData = !(loading || error)
    const spinner = loading ? <Spinner className="spinner" /> : null
    const errorMessage = error ? <ErrorMovies /> : null
    const content =
      hasData && ratedMovies && ratedMovies.length > 0 ? (
        <CardFilmList guestSessionId={guestSessionId} movies={ratedMovies} />
      ) : null

    // const alertMessage =
    //   !hasData || (hasData && (!ratedMovies.results || ratedMovies.results.length === 0)) ? (
    //     <Alert message="Нет оцененных фильмов" description="Оцените фильм" type="info" />
    //   ) : null

    return (
      <div>
        <Content className="content center">
          <div className="pagination-container">
            {errorMessage}
            {/* {alertMessage} */}
            {content}
            {spinner}

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
