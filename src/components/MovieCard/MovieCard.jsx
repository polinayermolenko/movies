import React from 'react';
import PropTypes from 'prop-types';

const MovieCard = ({ moviesList }) => {
  const { overview, title, releaseDate, posterPath } = moviesList;
  return (
    <article className="film-card">
      <img className="film-card__img" src={`${posterPath}`} alt="Film" />
      <div className="film-card__description">
        <h2 className="film-card__title">{title}</h2>
        <p className="film-card__release">{releaseDate}</p>
        <p className="film-card__genre">Action</p>
        <p className="film-card__overview">{overview}</p>
      </div>
    </article>
  );
};

export default MovieCard;

MovieCard.propTypes = {
  moviesList: PropTypes.shape({
    id: PropTypes.number,
    posterPath: PropTypes.string,
    title: PropTypes.string,
    releaseDate: PropTypes.string,
    overview: PropTypes.string,
  }).isRequired,
};
