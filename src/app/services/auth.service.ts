import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  base_url = environment.url;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService // private jwtHelper: JwtHelperService
  ) {
    const token = this.tokenService.getToken();
  }

  login(data: any): Promise<any> {
    return lastValueFrom(this.http.post(`${this.base_url}/auth/login`, data));
  }

  getUserByToken(queryParams: any = {}): Promise<any> {
    return lastValueFrom(
      this.http.get(`${this.base_url}/auth/me`, { params: queryParams })
    );
  }

  resetPassword(email: string) {
    return this.http.post(`${this.base_url}/auth/forgot-password`, { email });
  }

  storeToken(token: string, refreshToken: string) {
    this.tokenService.setToken(token);
    this.tokenService.setRefreshToken(refreshToken);
  }
}
