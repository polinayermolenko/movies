import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Search extends Component {
  state = {
    search: '',
  };

  onSeachChange = (evt) => {
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
        onChange={this.onSeachChange}
        value={search}
      />
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
