import React, { Component } from 'react';
import { Spin, Alert, Pagination } from 'antd';
import { debounce } from 'lodash';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';
import Search from '../Search/Search';

export default class App extends Component {
  movies = new MovieService();

  timerId = null;

  state = {
    moviesList: null,
    page: null,
    totalResults: null,
    loading: false,
    error: false,
    hasData: false,
    loadingPage: true,
    search: null,
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({
        loadingPage: false,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  onMoviesLoaded = (moviesList) => {
    const { results, page, totalResults } = moviesList;
    this.setState({
      moviesList: results,
      page,
      totalResults,
      loading: false,
      hasData: true,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onPageChange = (value) => {
    const { search } = this.state;
    this.setState({
      loading: true,
      error: false,
    });
    this.updateMovies(search, value);
  };

  onSearchChange = debounce((search) => {
    if (search === '') {
      this.setState({
        hasData: false,
        error: false,
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      search,
    });
    this.updateMovies(search);
  }, 500);

  updateMovies = (search, value) => {
    this.movies.getMoviesBySearch(search, value).then(this.onMoviesLoaded).catch(this.onError);
  };

  render() {
    const { moviesList, loading, error, hasData, loadingPage, page, totalResults } = this.state;

    if (loadingPage) {
      return <Spin tip="Loading ..." />;
    }

    const errorMessage = error && <Alert message="Error" description="Couldn't find the movie" type="error" showIcon />;
    const spinner = loading && <Spin tip="Loading ..." />;
    const content = hasData && !(loading || error) && <MovieList moviesList={moviesList} />;

    return (
      <main className="container">
        <Search onSearch={this.onSearchChange} />
        <section className="films">
          {spinner}
          {content}
          {errorMessage}
        </section>
        {hasData && !(loading || error) && (
          <Pagination
            current={page}
            total={totalResults}
            pageSize={20}
            showSizeChanger={false}
            onChange={this.onPageChange}
          />
        )}
      </main>
    );
  }
}
