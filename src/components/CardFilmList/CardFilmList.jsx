import React from 'react'

import './CardFilmList.css'
import CardFilm from './CardFilm/CardFilm'

const CardFilmList = () => {
  return (
    <div className="card-list">
      <CardFilm />
      <CardFilm />
      <CardFilm />
      <CardFilm />
    </div>
  )
}

export default CardFilmList
