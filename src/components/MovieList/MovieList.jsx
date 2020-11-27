import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';

const MovieList = ({ moviesList }) => {
  const movies = moviesList.map((item) => {
    return (
      <li key={item.id} className="films-list__item">
        <MovieCard moviesList={item} />
      </li>
    );
  });

  return <ul className="films-list">{movies}</ul>;
};

export default MovieList;

MovieList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};
