import { format } from 'date-fns';
import noImage from '../images/no-image.png';
import cutText from '../utils/cutText';

export default class MovieTransformService {
  transformMovie = (movie) => {
    const copyMovie = { ...movie };
    const imgBase = `https://image.tmdb.org/t/p/w500`;

    const { id, title, genre_ids: genreIds, rating, vote_average: voteAverage } = copyMovie;
    let { poster_path: posterPath, release_date: releaseDate, overview } = copyMovie;

    posterPath = posterPath ? `${imgBase}${posterPath}` : noImage;

    overview = cutText(overview);

    if (!releaseDate) {
      releaseDate = '';
    } else {
      releaseDate = format(new Date(releaseDate), 'MMMM d, yyyy');
    }

    return {
      id,
      posterPath,
      title,
      genreIds,
      releaseDate,
      overview,
      rating,
      voteAverage,
    };
  };
}
