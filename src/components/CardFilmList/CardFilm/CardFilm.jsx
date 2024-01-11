import React, { Component } from 'react'
import { Row, Card, Typography, Col, Rate } from 'antd'
import './CardFilm.css'
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'

import MoviesApi from '../../../services/movie.service'

const { Title, Text } = Typography

class CardFilm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      genres: [],
    }
  }

  componentDidMount() {
    this.loadGenres()
  }

  loadGenres = async () => {
    const moviesApi = new MoviesApi()

    try {
      const genreList = await moviesApi.getGenreList()
      this.setState({ genres: genreList })
    } catch (error) {
      console.error('Error loading genre list:', error)
    }
  }

  trimmedText(text, maxLength) {
    if (text.length <= maxLength) return text

    const myOverview = text.split(' ')
    let trimmedString = myOverview.slice(0, maxLength).join(' ')
    return trimmedString + '...'
  }

  render() {
    const { movie } = this.props
    const { title, overview, poster_path, genre_ids, vote_average, release_date } = movie
    const { genres } = this.state
    const newOwerview = this.trimmedText(overview, 45)

    const formateDate = release_date
      ? format(parseISO(release_date), 'MMMM dd, yyyy', { local: enGB })
      : 'Время не указано'

    const movieRate = vote_average
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
      <Card hoverable className="card" size="default">
        <Row style={{ height: '100%' }} gutter={20}>
          <Col span={11}>
            <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt="фото" className="image"></img>
          </Col>
          <Col span={13}>
            <Row gutter={15}>
              <Col span={20}>
                <Title className="title" level={5}>
                  {title}
                </Title>
              </Col>
              <Col className="vote" style={{ borderColor: movieColor }}>
                <span className="vote_average">{vote_average}</span>
              </Col>
              <Col>
                <Text style={{ color: '#827E7E', size: '12px' }}>{formateDate} </Text>
              </Col>
              <Col span={21} className="genres">
                {genres && genres.length > 0 ? (
                  genres
                    .filter((genre) => genre_ids.includes(genre.id))
                    .map((genre) => (
                      <Text code key={genre.id}>
                        {genre.name}
                      </Text>
                    ))
                ) : (
                  <span>No genres available</span>
                )}
              </Col>
              <Col span={22} className="description">
                <Text>{newOwerview}</Text>
              </Col>
              <Col>
                <Rate count={10}></Rate>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default CardFilm
