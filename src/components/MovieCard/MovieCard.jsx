import React, { Component } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';
import MovieService from '../../services/MovieService';

export default class MovieCard extends Component {
  movies = new MovieService();

  rateMovie = (rating) => {
    const {
      movie: { id },
      guestSessionId,
      updateRating,
    } = this.props;
    this.movies.postMovieRating(id, guestSessionId, rating).then(() => updateRating(guestSessionId, id, rating));
  };

  transformGenres = () => {
    const {
      movie: { genreIds },
      genreData,
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
      // eslint-disable-next-line react/prop-types
      movie: { overview, title, releaseDate, posterPath, rating },
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
          <Rate className="film-card__stars" allowHalf count={10} value={rating} onChange={this.rateMovie} />
        </div>
      </article>
    );
  }
}

MovieCard.propTypes = {
  genreData: PropTypes.objectOf(PropTypes.string).isRequired,
  guestSessionId: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    id: PropTypes.number,
    posterPath: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
    rating: PropTypes.string,
    genreIds: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};
