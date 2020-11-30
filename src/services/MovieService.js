import { format } from 'date-fns';
import noImage from '../images/no-image.png';

export default class MovieService {
  async getResponse(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();

    if (body.results.length === 0) {
      throw new Error(`Couldn't find the movie`);
    }
    return body;
  }

  async getAllMovies() {
    const res = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=7201476bfa706101ff5b93dcaddc37e7&query=movie`
    );
    return res.results;
  }

  async getMoviesBySearch(search, page = 1) {
    const movies = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=7201476bfa706101ff5b93dcaddc37e7&language=en-US&query=${search}&page=${page}&include_adult=false`
    );

    const moviesData = {
      page: movies.page,
      totalResults: movies.total_results,
    };

    const moviesResults = movies.results.map(this.transformMovie);
    return { ...moviesData, results: moviesResults };
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
      releaseDate,
      overview,
    };
  };
}

// const mov = new MovieService();
// mov.getMoviesBySearch('cat').then(body=> console.log(body));
