import React, { Component } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import MovieService from '../../services/MovieService';

export default class MovieCard extends Component {
  movies = new MovieService();

  transformGenres = () => {
    // eslint-disable-next-line react/prop-types
    const {
      moviesList: { genreIds },
      genreData,
    } = this.props;
    // eslint-disable-next-line react/prop-types
    return genreIds.map((id) => {
      return (
        <li key={id} className="film-card__genre-item">
          {genreData[id]}
        </li>
      );
    });
  };

  render() {
    const {
      moviesList: { overview, title, releaseDate, posterPath },
    } = this.props;
    const genreNames = this.transformGenres();
    return (
      <article className="film-card">
        <img className="film-card__img" src={`${posterPath}`} alt="Film" />
        <div className="film-card__description">
          <h2 className="film-card__title">{title}</h2>
          <p className="film-card__release">{releaseDate}</p>
          <ul className="film-card__genre">{genreNames}</ul>
          <p className="film-card__overview">{overview}</p>
          <Rate allowHalf defaultValue={0} count={10} />
        </div>
      </article>
    );
  }
}

MovieCard.propTypes = {
  genreData: PropTypes.objectOf(PropTypes.string).isRequired,
  moviesList: PropTypes.shape({
    id: PropTypes.number,
    posterPath: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
    genreIDs: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};
