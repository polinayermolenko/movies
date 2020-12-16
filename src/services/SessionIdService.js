import BaseService from './BaseService';

export default class SessionIdService extends BaseService {
  async getSessionId() {
    const { guest_session_id: guestSessionId } = await this.getResponse(
      `${this.apiBase}authentication/guest_session/new?${this.apiKey}`
    );
    return guestSessionId;
  }
}
