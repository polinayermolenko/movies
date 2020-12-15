import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';
import './MovieList.css';

const MovieList = ({ moviesList, guestSessionId, updateRating, onError }) => {
  const movies = moviesList.map((item) => {
    return (
      <li key={item.id} className="films-list__item">
        <MovieCard movie={item} guestSessionId={guestSessionId} updateRating={updateRating} onError={onError} />
      </li>
    );
  });

  return <ul className="films-list">{movies}</ul>;
};

export default MovieList;

MovieList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  guestSessionId: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
