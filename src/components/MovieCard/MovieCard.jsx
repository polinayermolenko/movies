import React, { Component } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MovieService from '../../services/MovieService';
import { GenreConsumer } from '../GenreContext/GenreContext';

import './MovieCard.css';

export default class MovieCard extends Component {
  movies = new MovieService();

  rateMovie = (rating) => {
    const {
      movie,
      movie: { id },
      guestSessionId,
      updateRating,
      onError,
    } = this.props;
    this.movies
      .postMovieRating(id, guestSessionId, rating)
      .then(() => updateRating(movie, rating))
      .catch(onError);
  };

  transformGenres = (genreData) => {
    const {
      movie: { genreIds },
    } = this.props;

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
      movie: { overview, title, releaseDate, posterPath, rating, voteAverage },
    } = this.props;

    const votingClass = classNames('film-card__voting', {
      'film-card__voting--low': voteAverage <= 3,
      'film-card__voting--middle': voteAverage <= 5,
      'film-card__voting--high': voteAverage <= 7,
      'film-card__voting--top': voteAverage > 7,
    });

    return (
      <GenreConsumer>
        {(genreData) => {
          const genreNames = this.transformGenres(genreData);
          return (
            <article className="film-card">
              <div className="film-card__img-container">
                <img className="film-card__img" src={`${posterPath}`} alt="Film" />
              </div>

              <div className="film-card__description">
                <div className="film-card__rating">
                  <h2 className="film-card__title">{title}</h2>
                  <span className={votingClass}>{voteAverage}</span>
                </div>
                <p className="film-card__release">{releaseDate}</p>
                <ul className="film-card__genre">{genreNames}</ul>
              </div>
              <p className="film-card__overview">{overview}</p>
              <Rate className="film-card__stars" allowHalf count={10} value={rating} onChange={this.rateMovie} />
            </article>
          );
        }}
      </GenreConsumer>
    );
  }
}

MovieCard.propTypes = {
  guestSessionId: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    id: PropTypes.number,
    posterPath: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
    rating: PropTypes.number,
    voteAverage: PropTypes.number,
    genreIds: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};
