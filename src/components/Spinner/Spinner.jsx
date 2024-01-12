import React from 'react'
import { Spin } from 'antd'
const Spinner = () => (
  <Spin tip="Loading" size="large">
    <div className="content" />
  </Spin>
)
export default Spinner
