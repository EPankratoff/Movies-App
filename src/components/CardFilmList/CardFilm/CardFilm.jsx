import React, { useState, useEffect } from 'react'
import { Row, Card, Typography, Col } from 'antd'
import './CardFilm.css'

import MoviesApi from '../../../services/movie.service'

const { Title, Text } = Typography

const CardFilm = ({ movie }) => {
  console.log(movie)
  const { title, overview, poster_path, genre_ids } = movie
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const moviesApi = new MoviesApi()

    const loadGenres = async () => {
      try {
        const genreList = await moviesApi.getGenreList()
        setGenres(genreList)
      } catch (error) {
        console.error('Error loading genre list:', error)
      }
    }

    loadGenres()
  }, [])

  return (
    <Card
      style={{
        height: '280px',
        position: 'relative',
        borderRadius: '0',
        width: '454px',
        paddingRight: '10px',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      }}
    >
      <Row style={{ height: '100%' }} gutter={15}>
        <Col span={11}>
          <img
            style={{ height: '280px', objectFit: 'cover' }}
            src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
            alt="фото"
          ></img>
        </Col>
        <Col span={13}>
          <Row gutter={15}>
            <Col span={24}>
              <Title style={{ width: '88%', marginTop: '12px' }} level={3}>
                {title}
              </Title>
              <Text style={{ color: '#827E7E', size: '12px' }}>March 5, 2020 </Text>
            </Col>
            <Col span={24}>
              {genres && genres.length > 0 ? (
                genres
                  .filter((genre) => genre_ids.includes(genre.id))
                  .map((genre) => (
                    <Text code key={genre.id} className="genres">
                      {genre.name}
                    </Text>
                  ))
              ) : (
                <span>No genres available</span>
              )}
            </Col>
            <Col span={24}>
              <Text className="description">{overview}</Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CardFilm
