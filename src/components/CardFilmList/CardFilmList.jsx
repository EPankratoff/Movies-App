import React from 'react'

import './CardFilmList.css'
import CardFilm from './CardFilm/CardFilm'

const CardFilmList = ({ movies }) => {
  return (
    <div className="card-list">
      {movies.map((movie) => (
        <CardFilm key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default CardFilmList
