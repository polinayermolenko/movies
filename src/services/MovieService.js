import { format } from 'date-fns';

export default class MovieService {
  async getResponse(url) {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    const body = await res.json();
    return body;
  }

  async getAllMovies() {
    const res = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=7201476bfa706101ff5b93dcaddc37e7&query=movie`
    );
    return res.results;
  }

  async getMoviesByReturn() {
    const movies = await this.getResponse(
      `https://api.themoviedb.org/3/search/movie?api_key=7201476bfa706101ff5b93dcaddc37e7&language=en-US&query=return&page=1&include_adult=false`
    );
    return movies.results.map(this.transformMovie);
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
    let posterPath = copyMovie.poster_path;
    if (!posterPath) {
      posterPath = 'https://rudnichka.ru/wp-content/uploads/2020/07/dquestion_app_widget_2_c.png';
    }

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
