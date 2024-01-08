import React from 'react'
import { Row, Card, Typography, Col } from 'antd'

import './CardFilm.css'
// import Card from './Card/Card'
import photo from '../../../assets'

const { Title, Text } = Typography

const CardFilm = () => {
  return (
    <Card
      style={{
        height: '100%',
        position: 'relative',
        borderRadius: '0',
        width: '100%',
        paddingRight: '10px',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      }}
    >
      <Row style={{ height: '100%' }} gutter={16}>
        <Col span={6}>
          <img style={{ height: '100%', width: '100%', objectFit: 'cover' }} src={photo} alt="фото"></img>
        </Col>
        <Col span={18}>
          <Row gutter={10}>
            <Col span={24}>
              <Title style={{ width: '88%', marginTop: '12px' }} level={3}>
                The way back
              </Title>
              <Text style={{ color: '#827E7E', size: '12px' }}>March 5, 2020 </Text>
            </Col>
            <Col span={24}>
              <Text code>Жанр фильма</Text>
            </Col>
            <Col span={12}>
              <Text ellipsis={{ rows: 6 }}>
                A former basketball all-star, who has lost his wife and family foundation in a struggle with addiction
                attempts to regain his soul and salvation by becoming the coach of a disparate ethnically mixed high ...
              </Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
export default CardFilm
