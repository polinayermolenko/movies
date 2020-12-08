import React, { Component } from 'react';
import { Spin, Alert, Pagination, Tabs } from 'antd';
import { debounce } from 'lodash';
import MovieList from '../MovieList/MovieList';
import MovieService from '../../services/MovieService';
import Search from '../Search/Search';

export default class App extends Component {
  movies = new MovieService();

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
  };

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({
        loadingPage: false,
      });
    }, 1000);

    this.movies.getSessionId().then((guestSessionId) => this.setState({ guestSessionId }));

    this.movies.getGenres().then((body) => {
      this.genreData = body.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
      return this.genreData;
    });
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

  onRatedMoviesLoaded = (moviesList) => {
    const { results, page, totalRatedResults } = moviesList;
    this.setState({
      isTabRated: true,
      ratedFilms: results,
      page,
      totalRatedResults,
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

  updateRating = (guestSessionId, id, rating) => {
    this.movies.getRatedMovies(guestSessionId).then(() => {
      this.setState(({ moviesList }) => {
        const newMoviesList = moviesList.map((item) => {
          if (item.id === id) {
            return { ...item, rating };
          }
          return item;
        });
        return {
          moviesList: newMoviesList,
        };
      });
    });
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
        genreData={this.genreData}
        guestSessionId={guestSessionId}
        updateRating={this.updateRating}
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
          {spinner}
          {content}
          {errorMessage}
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
