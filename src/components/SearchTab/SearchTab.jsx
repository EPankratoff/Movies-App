import React from 'react'
import { Layout, Alert, Pagination } from 'antd'

import CardFilmList from '../CardFilmList/CardFilmList'
import Spinner from '../Spinner/Spinner'
import ErrorMovies from '../ErrorMovies/ErrorMovies'
import SearchFilm from '../SearchFilm/SearchFilm'

const { Content } = Layout
const SearchTab = (props) => {
  const {
    movies,
    loading,
    error,
    current,
    total,
    noResults,
    onChange,
    onSearch,
    guestSessionId,
    onPostRating,
    onDeleteRating,
  } = props
  const hasData = !(loading || error)
  const errorMessage = error ? <ErrorMovies /> : null
  const spinner = loading ? <Spinner className="spinner" /> : null
  const content = hasData ? (
    <CardFilmList
      movies={movies}
      loading={loading}
      guestSessionId={guestSessionId}
      onPostRating={onPostRating}
      onDeleteRating={onDeleteRating}
    />
  ) : null
  const noResultsMessage = noResults ? (
    <Alert message="Нет результатов." description="Поробуйте изменить свой запрос по поиску фильмов" type="info" />
  ) : null
  return (
    <>
      <Content className="content center">
        <SearchFilm onSearch={onSearch} />
        {errorMessage}
        {content}
      </Content>
      {noResultsMessage}
      {spinner}
      <Pagination onChange={onChange} current={current} total={total} showSizeChanger={false} />
    </>
  )
}

export default SearchTab
