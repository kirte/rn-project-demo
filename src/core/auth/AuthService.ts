import { injectable } from 'inversify';

@injectable()
export class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  async init() { return; }
  async login(username: string, password: string) { this.token = `token-${username}-${Date.now()}`; this.refreshToken = `refresh-${username}-${Date.now()}`; return { success: true, token: this.token }; }
  getToken() { return this.token; }
  getRefreshToken() { return this.refreshToken; }
  setToken(t: string) { this.token = t; }
  logout() { this.token = null; this.refreshToken = null; }
}
