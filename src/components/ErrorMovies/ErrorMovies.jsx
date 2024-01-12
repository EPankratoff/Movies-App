import React from 'react'
import { Alert, Space } from 'antd'

const ErrorMovies = () => {
  return (
    <Space
      direction="vertical"
      style={{
        width: '100%',
      }}
    >
      <Alert message="Что-то пошло не так" description="Но скоро все исправится " type="error" showIcon />{' '}
    </Space>
  )
}

export default ErrorMovies
