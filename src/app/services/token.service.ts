import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root',
})
export class TokenService {
	private tokenKey = '_tk';
	private refreshTokenKey = `_tk-rs`;

	constructor(private cookieService: CookieService) {}

	setToken(token: string): void {
		this.cookieService.set(this.tokenKey, token, {
			secure: true,
			sameSite: 'Strict',
			path: '/',
		});
	}

	getToken(): string {
		return this.cookieService.get(this.tokenKey);
	}

	clearToken(): void {
		this.cookieService.delete(this.tokenKey);
	}

	setRefreshToken(token: string): void {
		this.cookieService.set(this.refreshTokenKey, token, {
			secure: true,
			sameSite: 'Strict',
			path: '/',
		});
	}

	getRefreshToken(): string {
		return this.cookieService.get(this.refreshTokenKey);
	}

	clearRefreshToken(): void {
		this.cookieService.delete(this.refreshTokenKey);
	}
}
