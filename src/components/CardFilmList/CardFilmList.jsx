import React from 'react'

import './CardFilmList.css'

import CardFilm from './CardFilm/CardFilm'

const CardFilmList = ({ movies, loading, onDeleteRating, onPostRating, guestSessionId, ratedMovies }) => {
  return (
    <div className="card-list">
      {movies.map((movie) => (
        <CardFilm
          ratedMovies={ratedMovies}
          guestSessionId={guestSessionId}
          key={movie.id}
          movie={movie}
          loading={loading}
          onPostRating={onPostRating}
          onDeleteRating={onDeleteRating}
        />
      ))}
    </div>
  )
}

export default CardFilmList
