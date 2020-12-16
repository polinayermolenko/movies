import BaseService from './BaseService';

export default class MovieRatingService extends BaseService {
  async postMovieRating(id, guestSessionId, rating) {
    const response = await fetch(
      `${this.apiBase}movie/${id}/rating?${this.apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    );

    if (!response.ok) {
      throw new Error(`Could not find the movie`);
    }
  }
}
