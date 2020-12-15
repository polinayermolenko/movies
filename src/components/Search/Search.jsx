import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Search.css';

export default class Search extends Component {
  state = {
    search: '',
  };

  onSearchChange = (evt) => {
    const { onSearch } = this.props;
    const search = evt.target.value;
    this.setState({ search });
    onSearch(search);
  };

  render() {
    const { search } = this.state;
    return (
      <input
        type="text"
        className="search"
        placeholder="Type to search..."
        onChange={this.onSearchChange}
        value={search}
      />
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
