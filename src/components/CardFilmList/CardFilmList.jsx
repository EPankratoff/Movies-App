import React from 'react'

import './CardFilmList.css'

import CardFilm from './CardFilm/CardFilm'

const CardFilmList = ({ movies, loading }) => {
  return (
    <div className="card-list">
      {movies.map((movie) => (
        <CardFilm key={movie.id} movie={movie} loading={loading} />
      ))}
    </div>
  )
}

export default CardFilmList
