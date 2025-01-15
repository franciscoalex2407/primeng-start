import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from './layout/service/layout.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'primeng-start';

	constructor(public layoutService: LayoutService) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.layoutService.preloaderHide();
		}, 2000); // Delay para animação
	}
}
