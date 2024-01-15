import { Input } from 'antd'
import React, { Component } from 'react'
import { debounce } from 'lodash'

export default class SearchFilm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInput: '',
    }
    this.debounceFunction = debounce(this.handleSearch, 500).bind(this)
  }

  handleInput = (e) => {
    const { value } = e.target
    this.setState({ searchInput: value }, () => {
      console.log('Debounce value:', value)
      this.debounceFunction(value)
    })
  }

  handleSearch = (query) => {
    const { onSearch } = this.props
    console.log('Searching for:', query)
    if (onSearch) {
      onSearch(query)
    }
  }

  render() {
    const { searchInput } = this.state
    return (
      <Input
        style={{ width: '100%', margin: '0 auto' }}
        placeholder="Type to search..."
        value={searchInput}
        onChange={(e) => this.handleInput(e)}
      />
    )
  }
}
