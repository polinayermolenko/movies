import React from 'react';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard';

const MovieList = ({ moviesList, genreData, guestSessionId, updateRating }) => {
  const movies = moviesList.map((item) => {
    return (
      <li key={item.id} className="films-list__item">
        <MovieCard movie={item} genreData={genreData} guestSessionId={guestSessionId} updateRating={updateRating} />
      </li>
    );
  });

  return <ul className="films-list">{movies}</ul>;
};

export default MovieList;

MovieList.propTypes = {
  moviesList: PropTypes.arrayOf(PropTypes.object).isRequired,
  genreData: PropTypes.objectOf(PropTypes.string).isRequired,
  guestSessionId: PropTypes.string.isRequired,
  updateRating: PropTypes.func.isRequired,
};
