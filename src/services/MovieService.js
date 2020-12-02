import { format } from 'date-fns';
import noImage from '../images/no-image.png';

export default class MovieService {
  apiBase = `https://api.themoviedb.org/3/`;

  apiKey = `api_key=7201476bfa706101ff5b93dcaddc37e7`;

  async getResponse(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();

    return body;
  }

  async getSessionId() {
    const { guest_session_id: guestSessionId } = await this.getResponse(
      `${this.apiBase}authentication/guest_session/new?${this.apiKey}`
    );
    return guestSessionId;
  }

  async getRatedmovies(guestSessionId) {
    const ratedMovies = await this.getResponse(
      `${this.apiBase}guest_session/${guestSessionId}/rated/movies?${this.apiKey}&language=en-US&sort_by=created_at.asc`
    );
    return ratedMovies;
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

    const moviesResults = movies.results.map(this.transformMovie);
    return { ...moviesData, results: moviesResults };
  }

  async getGenres() {
    const { genres } = await this.getResponse(`${this.apiBase}genre/movie/list?${this.apiKey}&language=en-US`);
    return genres;
  }

  cutText = (text) => {
    if (text.length > 150) {
      for (let i = 150; i > 0; i--) {
        if (
          text.charAt(i) === ' ' &&
          (text.charAt(i - 1) !== ',' || text.charAt(i - 1) !== '.' || text.charAt(i - 1) !== ';')
        ) {
          return `${text.substring(0, i)}...`;
        }
      }
    }
    return text;
  };

  transformMovie = (movie) => {
    const copyMovie = { ...movie };
    const imgBase = `https://image.tmdb.org/t/p/w500`;
    let posterPath = copyMovie.poster_path;

    posterPath = posterPath ? `${imgBase}${posterPath}` : noImage;

    const overview = this.cutText(copyMovie.overview);

    let releaseDate = copyMovie.release_date;
    if (!releaseDate) {
      releaseDate = '';
    } else {
      releaseDate = format(new Date(releaseDate), 'MMMM d, yyyy');
    }

    return {
      id: movie.id,
      posterPath,
      title: movie.title,
      genreIds: movie.genre_ids,
      releaseDate,
      overview,
    };
  };
}

// const mov = new MovieService();
// mov.getMoviesBySearch('nokpl[kohjo[').then(body=> console.log(body));
