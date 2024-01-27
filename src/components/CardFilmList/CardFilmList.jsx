import React from 'react'

import './CardFilmList.css'

import CardFilm from './CardFilm/CardFilm'

const CardFilmList = ({ movies, loading, onDeleteRating, onPostRating, guestSessionId }) => {
  return (
    <div className="card-list">
      {movies.map((movie) =>
        movie ? (
          <CardFilm
            guestSessionId={guestSessionId}
            key={movie.id}
            movie={movie}
            loading={loading}
            onPostRating={onPostRating}
            onDeleteRating={onDeleteRating}
          />
        ) : null
      )}
    </div>
  )
}

export default CardFilmList
