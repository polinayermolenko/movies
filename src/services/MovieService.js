import BaseService from './BaseService';
import MovieTransformService from './MovieTransformService';

export default class MovieService extends BaseService {
  movieTransformService = new MovieTransformService();

  async getRatedMovies(guestSessionId, page = 1) {
    const ratedMovies = await this.getResponse(
      `${this.apiBase}guest_session/${guestSessionId}/rated/movies?${this.apiKey}&page=${page}&sort_by=created_at.asc`
    );

    const moviesData = {
      page: ratedMovies.page,
      totalRatedResults: ratedMovies.total_results,
    };

    const moviesResults = ratedMovies.results.map(this.movieTransformService.transformMovie);
    return { ...moviesData, results: moviesResults };
  }

  async getMoviesBySearch(search, page = 1) {
    const movies = await this.getResponse(
      `${this.apiBase}search/movie?${this.apiKey}&language=en-US&query=${search}&page=${page}&include_adult=false`
    );

    const moviesData = {
      page: movies.page,
      totalResults: movies.total_results,
    };

    if (movies.results.length === 0) {
      throw new Error(`Couldn't find the movie`);
    }

    const moviesResults = movies.results.map(this.movieTransformService.transformMovie);
    return { ...moviesData, results: moviesResults };
  }

  async getGenres() {
    const { genres } = await this.getResponse(`${this.apiBase}genre/movie/list?${this.apiKey}&language=en-US`);
    return genres;
  }
}
