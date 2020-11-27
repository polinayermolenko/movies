import React, { Component } from 'react';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';

export default class App extends Component {
  movies = new MovieService();

  state = {
    moviesList: null,
  };

  componentDidMount() {
    this.movies.getMoviesByReturn().then((moviesList) => {
      this.setState({ moviesList });
    });
  }

  render() {
    const { moviesList } = this.state;
    const content = moviesList ? <MovieList moviesList={moviesList} /> : null;

    return <section className="films">{content}</section>;
  }
}
