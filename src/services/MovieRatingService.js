import BaseService from './BaseService';

export default class MovieRatingService extends BaseService {
  async postMovieRating(id, guestSessionId, rating) {
    await this.postResponse(
      `${this.apiBase}movie/${id}/rating?${this.apiKey}&guest_session_id=${guestSessionId}`,
      rating
    );
  }
}
