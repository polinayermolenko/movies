import React, { Component } from 'react';
import { Spin, Alert, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';
import Search from '../Search/Search';
import { GenreProvider } from '../GenreContext/GenreContext';
import SessionIdService from '../../services/SessionIdService';
import './App.css';

export default class App extends Component {
  movies = new MovieService();

  sessionIdService = new SessionIdService();

  timerId = null;

  genreData = null;

  state = {
    moviesList: null,
    page: null,
    totalResults: null,
    loading: false,
    error: false,
    hasData: false,
    loadingPage: true,
    search: null,
    guestSessionId: null,
    isTabRated: false,
    ratedFilms: null,
    totalRatedResults: null,
    cache: {},
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({
        loadingPage: false,
      });
    }, 1000);

    this.sessionIdService.getSessionId().then((guestSessionId) => this.setState({ guestSessionId }));

    this.movies.getGenres().then((body) => {
      this.genreData = body.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
      return this.genreData;
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  onMoviesLoaded = ({ results, page, totalResults }) => {
    const { cache } = this.state;
    const updatedResults = this.updateData(results, cache);

    this.setState({
      moviesList: updatedResults,
      page,
      totalResults,
      loading: false,
      error: false,
      hasData: !!results.length,
    });
  };

  onRatedMoviesLoaded = ({ results, page, totalRatedResults }) => {
    this.setState({
      isTabRated: true,
      ratedFilms: results,
      page,
      totalRatedResults,
      loading: false,
      hasData: !!results.length,
    });
  };

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    });
  };

  onPageChange = (value) => {
    const { search, isTabRated } = this.state;
    this.setState({
      loading: true,
      error: false,
      page: value,
    });

    if (isTabRated) {
      this.rateMovies(value);
    } else {
      this.updateMovies(search, value);
    }
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
    this.movies
      .getMoviesBySearch(search, value)
      .then((body) => this.onMoviesLoaded(body))
      .catch(this.onError);
  };

  updateData = (data, cache) => {
    for (const key in cache) {
      if (!Object.prototype.hasOwnProperty.call(cache, key)) {
        return data;
      }
    }

    return data.map((movie) => cache[movie.id] || movie);
  };

  updateRating = (movie, rating) => {
    const { moviesList, ratedFilms, isTabRated, cache } = this.state;
    const updatedCache = { ...cache };
    updatedCache[movie.id] = { ...movie, rating };

    const updatedData = this.updateData(moviesList, updatedCache);

    if (isTabRated) {
      const updatedRatedData = this.updateData(ratedFilms, updatedCache);
      this.setState(() => ({ moviesList: updatedData, ratedFilms: updatedRatedData, cache: updatedCache }));
      return;
    }

    this.setState(() => ({ moviesList: updatedData, cache: updatedCache }));
  };

  rateMovies = (page = 1) => {
    const { guestSessionId } = this.state;
    this.movies
      .getRatedMovies(guestSessionId, page)
      .then((body) => this.onRatedMoviesLoaded(body))
      .catch(this.onError);
  };

  toggleRatedMode = (activeKey) => {
    if (activeKey === 'Rated') {
      this.rateMovies();
    } else {
      const { isTabRated } = this.state;
      this.setState(() => ({ isTabRated: !isTabRated }));
    }
  };

  render() {
    const {
      moviesList,
      loading,
      error,
      hasData,
      loadingPage,
      page,
      totalResults,
      totalRatedResults,
      guestSessionId,
      isTabRated,
      ratedFilms,
    } = this.state;
    const { TabPane } = Tabs;

    if (loadingPage) {
      return <Spin tip="Loading ..." />;
    }

    const errorMessage = error && <Alert message="Error" description="Couldn't find the movie" type="error" showIcon />;
    const spinner = loading && <Spin tip="Loading ..." />;
    const content = hasData && !(loading || error) && (
      <MovieList
        moviesList={isTabRated ? ratedFilms : moviesList}
        guestSessionId={guestSessionId}
        updateRating={this.updateRating}
        onError={this.onError}
      />
    );

    return (
      <main className="container">
        <Tabs
          defaultActiveKey="Search"
          activeKey={isTabRated ? 'Rated' : 'Search'}
          size="large"
          onChange={this.toggleRatedMode}
          centered
        >
          <TabPane tab="Search" key="Search" />
          <TabPane tab="Rated" key="Rated" />
        </Tabs>
        {!isTabRated && <Search onSearch={this.onSearchChange} />}
        <section className="films">
          <GenreProvider value={this.genreData}>
            {spinner}
            {content}
            {errorMessage}
          </GenreProvider>
        </section>
        {hasData && !(loading || error) && (
          <Pagination
            current={page}
            total={isTabRated ? totalRatedResults : totalResults}
            pageSize={20}
            showSizeChanger={false}
            onChange={this.onPageChange}
          />
        )}
      </main>
    );
  }
}
