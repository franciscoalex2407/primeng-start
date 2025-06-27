import { Injectable } from '@angular/core';
import Push from 'push.js';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private audio = new Audio('assets/notification.wav'); // Adicione o som na pasta assets

	constructor() {
		this.requestPermission();
	}

	requestPermission() {
		if ('Notification' in window) {
			Notification.requestPermission();
		}
	}

	showNotification(title: string, body: string) {
		if (Notification.permission === 'granted') {
			const pushItem = Push.create(title, {
				body,
				icon: 'assets/images/icon.png',
				timeout: 50000,
				onClick: async () => {
					window.focus();
					(await pushItem).close();
				},
			});

			// Toca o som
			this.audio.play();
		}
	}
}
