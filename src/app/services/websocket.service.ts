import { Injectable, isDevMode } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class WebSocketService {
	Pusher = Pusher;
	echo = new Echo({
		broadcaster: 'reverb',
		key: 'y7lymyexoeriqgidynl9',
		wsHost: environment.websocket,
		wsPort: environment.production ? 80 : 8080,
		wssPort: 443,
		forceTLS: false,
		disableStats: true,
		enabledTransports: ['ws', 'wss'],
		// cluster: 'mt1', // Adicione a propriedade cluster aqui
		// authorizer: (channel, options) => {
		//   return {
		//     authorize: (socketId, callback) => {
		//       callback(false, { auth: {} }); // Permitir a conexão sem autenticação
		//     },
		//   };
		// },
	});

	constructor() {
		if (isDevMode()) {
			this.Pusher.logToConsole = true;
		}
	}

	listenToUserNotifications(userId: any, callback: (notify: any) => void) {
		this.echo?.channel(`notification-channel-${userId}`).listen('.user.notification', (notify: any) => {
			callback(notify);
		});
	}
}
