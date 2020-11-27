import React, { Component } from 'react';
import { Spin, Alert } from 'antd';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';

export default class App extends Component {
  movies = new MovieService();

  state = {
    moviesList: null,
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.updateMovies();
  }

  onMoviesLoaded = (moviesList) => {
    this.setState({
      moviesList,
      loading: false,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  updateMovies = () => {
    this.movies.getMoviesByReturn().then(this.onMoviesLoaded).catch(this.onError);
  };

  render() {
    const { moviesList, loading, error } = this.state;
    const errorMessage = error ? (
      <Alert message="Error" description="Couldn't find the movie" type="error" showIcon />
    ) : null;
    const spinner = loading ? <Spin tip="Loading ..." /> : null;
    const content = !(loading || error) ? <MovieList moviesList={moviesList} /> : null;

    return (
      <section className="films">
        {spinner}
        {errorMessage}
        {content}
      </section>
    );
  }
}
