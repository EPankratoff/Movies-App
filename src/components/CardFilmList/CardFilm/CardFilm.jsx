import React, { Component } from 'react'
import { Row, Card, Typography, Col, Rate } from 'antd'
import './CardFilm.css'
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'

import { MoviesConsumer } from '../../MoviesContext/MoviesContext'
import assets from '../../../assets'

const { Title, Text } = Typography

class CardFilm extends Component {
  constructor(props) {
    super(props)
  }

  trimmedText(text) {
    const maxLength = 200
    if (!text || text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + '...'
  }

  handleRatingChange(value) {
    const { movie, onPostRating, onDeleteRating } = this.props

    if (value > 0) {
      onPostRating(movie.id, value)
    } else {
      onDeleteRating(movie.id)
    }
  }

  render() {
    const { movie } = this.props
    const { title, overview, poster_path, genre_ids, vote_average, release_date, rating } = movie
    const newOwerview = this.trimmedText(overview, 45)

    const formateDate = release_date
      ? format(parseISO(release_date), 'MMMM dd, yyyy', { local: enGB })
      : 'Время не указано'

    const movieRate = vote_average !== undefined ? parseFloat(vote_average.toFixed(1)) : 0

    let movieColor

    if (movieRate > 0 && movieRate < 3) {
      movieColor = '#E9000'
    } else if (movieRate >= 3 && movieRate < 5) {
      movieColor = '#E97E00'
    } else if (movieRate >= 5 && movieRate < 7) {
      movieColor = '#E9D100'
    } else {
      movieColor = '#66E900'
    }

    return (
      <MoviesConsumer>
        {({ genres }) => (
          <Card hoverable className="card" size="default">
            <Row
              style={{ height: '100%' }}
              gutter={{
                xs: 8,
                sm: 16,
                md: 20,
                lg: 20,
              }}
            >
              <Col span={11}>
                <img
                  src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : assets.zaglushka}
                  alt="фото"
                  className="image"
                ></img>
              </Col>
              <Col span={13}>
                <Row gutter={15}>
                  <Col span={20}>
                    <Title className="title" level={5}>
                      {title}
                    </Title>
                  </Col>
                  <Col className="vote" style={{ borderColor: movieColor }}>
                    <span className="vote_average">{movieRate}</span>
                  </Col>
                  <Col span={24}>
                    <Text style={{ color: '#827E7E', size: '12px' }}>{formateDate} </Text>
                  </Col>
                  <Col span={22} className="genres">
                    {genres && genre_ids.length > 0 ? (
                      genres
                        .filter((genre) => genre_ids && genre_ids.includes(genre.id))
                        .map((genre) => (
                          <Text code key={genre.id}>
                            {genre.name}
                          </Text>
                        ))
                    ) : (
                      <Text>No genres available</Text>
                    )}
                  </Col>
                  <Col span={22} className="description">
                    <Text>{newOwerview ? newOwerview : 'No Owerview...'}</Text>
                  </Col>
                  <Col>
                    <Rate
                      className="rate"
                      count={10}
                      value={rating}
                      onChange={(value) => this.handleRatingChange(value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}
      </MoviesConsumer>
    )
  }
}

export default CardFilm
