import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TitleService {
	constructor(private title: Title, private router: Router) {}

	init(): void {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => {
					const route = this.router.routerState.root;
					return this.getDeepestTitle(route);
				})
			)
			.subscribe((pageTitle) => {
				if (pageTitle) {
					this.title.setTitle(`${pageTitle}`);
				}
			});
	}

	private getDeepestTitle(route: any): string | null {
		let child = route;
		while (child.firstChild) {
			child = child.firstChild;
		}
		return child.snapshot?.data?.['title'] || null;
	}
}
