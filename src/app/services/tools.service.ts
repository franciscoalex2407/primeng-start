import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from '../core/reducers';
import { Logout } from '../core/actions/auth.action';
import { Router } from '@angular/router';
import { Subject, lastValueFrom, skipWhile, take } from 'rxjs';
import { currentUser } from '../core/selectors/auth.selector';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import moment from 'moment';
// import { Roles } from '../shared/properties';

@Injectable({
	providedIn: 'root',
})
export class ToolsService {
	noImageAvatar = 'assets/sem-foto.png';
	soundNotification = 'assets/sounds/notify.mp3';

	updateFloralSubject = new Subject<any>();
	updateParametersSubject = new Subject<any>();

	constructor(private store: Store<AppState>, public route: Router, private sanitizer: DomSanitizer) {}

	//comum
	async getCurrentUser() {
		return lastValueFrom(
			this.store.pipe(
				select(currentUser),
				skipWhile((user) => !user),
				take(1)
			)
		);
	}

	toBase64(file: File): Promise<any> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
		});
	}

	convertBlobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}

	validateInputForm(form: NgForm, model: string) {
		if (!form) {
			return true;
		}

		const control = form.controls[model];
		// console.log('validateInputForm', model, control);
		if (control && control.status == 'INVALID' && (form.submitted || control.touched)) {
			return false;
		}
		return true;
	}

	getControl(form: NgForm, model: string) {
		const controls: any = form?.controls;
		return controls[model];
	}

	getErrors(form: NgForm, model: string) {
		const errors = [];
		if (form instanceof NgForm) {
			const control: any = this.getControl(form, model);
			if (control?.errors && control?.errors['required']) {
				errors.push('Obrigatório.');
			}
			if (control?.errors && control?.errors['email']) {
				errors.push('E-mail inválido.');
			}
			// console.log('control', control);
		}

		return errors;
	}

	logout() {
		this.store.dispatch(new Logout());
	}

	getTimeFrom(date: string) {
		return moment(date).locale('pt-br').fromNow();
	}

	generateFormData(dados: any) {
		const formData = new FormData();

		for (let key of Object.keys(dados)) {
			if (dados[key] == undefined) {
				continue;
			}

			if (Array.isArray(dados[key])) {
				for (let value of dados[key]) {
					formData.append(`${key}[]`, value);
				}
			} else if (dados[key] instanceof Blob) {
				formData.append(key, dados[key]);
			} else if (typeof dados[key] == 'object') {
				formData.append(key, JSON.stringify(dados[key]));
			} else {
				formData.append(key, `${dados[key]}`);
			}
		}

		return formData;
	}

	getUrlSecurity(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

	getHtmlSecurity(html: any) {
		return this.sanitizer.bypassSecurityTrustHtml(html);
	}

	isMobileDevice() {
		return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('Mobile') !== -1;
	}

	onEnterPress(event: any) {
		event.preventDefault(); // Isso impede o comportamento padrão de pressionar Enter
	}

	playNotification() {
		// const sound = new Howl({
		//   src: [this.soundNotification], // Substitua pelo caminho do seu arquivo de áudio
		//   autoplay: true,
		// });
		// sound.play();
	}

	getScreenHeightPercentage(percentage: number): string {
		const heightInPixels = window.innerHeight * (percentage / 100);
		return `${heightInPixels}px`;
	}

	// Função para obter a mensagem de erro
	getErrorMessage(control: any): string {
		const errorMessages: any = {
			required: 'Este campo é obrigatório.',
			minlength: 'O valor é muito curto.',
			maxlength: 'O valor é muito longo.',
			email: 'O endereço de e-mail não é válido.',
			pattern: 'O valor não segue o padrão esperado.',
			mask: (requiredMask: string, actualValue: string) =>
				`Valor "${actualValue}" não corresponde ao formato: "${requiredMask}".`,
		};

		if (control.errors) {
			for (const error in control.errors) {
				if (control.errors.hasOwnProperty(error)) {
					// Verifica se é o erro de máscara personalizado
					if (error === 'mask') {
						const { requiredMask, actualValue } = control.errors[error];
						return errorMessages[error](requiredMask, actualValue);
					}

					return errorMessages[error];
				}
			}
		}
		return '';
	}

	// Função para marcar todos os controles do formulário como tocados
	markFormGroupTouched(formGroup: FormGroup) {
		Object.values(formGroup.controls).forEach((control) => {
			if (control instanceof FormControl) {
				control.markAsTouched();
			} else if (control instanceof FormGroup) {
				this.markFormGroupTouched(control);
			}
		});
	}

	returnControlIdInvalid(formGroup: FormGroup): string | null {
		const keys = Object.keys(formGroup.controls);
		for (const key of keys) {
			const control = formGroup.controls[key];
			if (control instanceof FormControl && control.invalid) {
				return key; // Retorna o nome do controle (ou seu ID, se preferir)
			} else if (control instanceof FormGroup) {
				const invalidControlId = this.returnControlIdInvalid(control);
				if (invalidControlId) {
					return invalidControlId;
				}
			}
		}
		return null;
	}
	scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// masks
	getMaskFormat(value: string) {
		let mask = value;
		switch (value) {
			case 'phone':
				mask = '(00) 0000-0000||(00) 9 0000-0000';
				break;
			default:
				break;
		}

		return mask;
	}

	// customizados
	getRole(role: string) {
		// const roles = Roles;
		// const find = roles.find((item) => item.key == role);
		// return find?.description ?? '';
	}

	showAttributeValue(item: any, attributeName: string) {
		let attributes: any[] = [];
		if (item?.integration?.slug == 'mercado_livre') {
			if (attributeName == 'PRICE') {
				return item?.data?.price ?? ' - ';
			}

			attributes = item?.data?.attributes;
			const find = attributes.find((attr) => attr.id == attributeName);
			if (find) {
				return find?.value_name;
			}
		}
		if (item?.integration?.slug == 'shopee') {
			if (attributeName == 'BRAND') {
				return item?.data?.brand?.original_brand_name ?? ' - ';
			}
			if (attributeName == 'PRICE') {
				return item?.data?.price_info[0].current_price ?? ' - ';
			}
		}

		return ' - ';
	}

	showAttributeValueAds(attributes: any[], attributeName: string) {
		const find = attributes.find((attr) => attr.id == attributeName);
		if (find) {
			return find?.value_name;
		}
		return attributes[0]?.value_name;
	}

	getCommissionML(listing_type_id: string) {
		let commission = 0;
		switch (listing_type_id) {
			case 'gold_special':
				commission = 12.0;
				break;
			case 'gold_pro':
				commission = 17.0;
				break;

			default:
				commission = 12.0;
				break;
		}

		return commission;
	}

	changePeriod(event: any, filters: any) {
		console.log('changePeriod', event);

		if (event && event == 'today') {
			filters.date_start = moment().format('YYYY-MM-DD');
			delete filters.date_end;
		} else if (event && event == 'lastSevenDays') {
			filters.date_start = moment().subtract(7, 'days').format('YYYY-MM-DD');
			filters.date_end = moment().format('YYYY-MM-DD');
		} else if (event && event == 'lastFiveTeenDays') {
			filters.date_start = moment().subtract(15, 'days').format('YYYY-MM-DD');
			filters.date_end = moment().format('YYYY-MM-DD');
		} else if (event && event == 'lastThirtyDays') {
			filters.date_start = moment().subtract(30, 'days').format('YYYY-MM-DD');
			filters.date_end = moment().format('YYYY-MM-DD');
		} else if (event && event == 'customDate') {
			filters.date_start = moment().subtract(1, 'days').format('YYYY-MM-DD');
			filters.date_end = moment().format('YYYY-MM-DD');
		}
	}

	cleanFilters(filters: any) {
		const keys = Object.keys(filters);
		for (let key of keys) {
			if (filters[key] == null || filters[key] == '') {
				delete filters[key];
			}
		}
		return filters;
	}

	isValidUrl(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch (_) {
			return false;
		}
	}

	calcSale(dados: any) {
		// Dados iniciais
		const cost = dados.cost ? parseFloat(dados.cost) : 0; // Custo do produto

		const discountAmount = 0; //parseFloat((cost * (per_discount / 100)).toFixed(2));

		const costWithDiscount = parseFloat((cost - discountAmount).toFixed(2));

		const per_profit = dados.per_profit ? parseFloat(dados.per_profit) : 0; // Custo do produto

		const per_commission = dados.per_commission ? parseFloat(dados.per_commission) / 100 : 0; // Comissão do marketplace

		const per_taxes = dados.per_taxes ? parseFloat(dados.per_taxes) / 100 : 0; // Impostos

		const per_others = dados.per_others ? parseFloat(dados.per_others) / 100 : 0; // Outras porcentagens

		const shipping_cost = dados.shipping_cost ? parseFloat(dados.shipping_cost) : 0; // Custo do frete

		const fixed_rate = dados.fixed_rate ? parseFloat(dados.fixed_rate) : 0; // Custo fixo mk

		const logistic_cost = dados.logistic_cost ? parseFloat(dados.logistic_cost) : 0; // Custo fixo logistica

		// Total de porcentagens adicionais sobre o preço de venda
		const total_percentage = per_commission + per_taxes + per_others + per_profit / 100; // Inclui o lucro

		// Cálculo do preço de venda necessário para garantir o lucro sobre o preço de venda final
		const finalSellingPrice =
			(costWithDiscount + shipping_cost + fixed_rate + logistic_cost) / (1 - total_percentage);

		// Calculando o lucro sobre o valor final de venda
		const desiredProfit = parseFloat((finalSellingPrice * (per_profit / 100)).toFixed(2));

		const totalSale = Math.floor(finalSellingPrice);
		const totalProfit = Math.floor(desiredProfit);

		return { totalSale, totalProfit };
	}

	calcMarkup(dados: any) {
		// Dados iniciais
		const cost = dados.cost ? parseFloat(dados.cost) : 0; // Custo do produto
		const per_discount = dados.per_discount ? parseFloat(dados.per_discount) : 0; // Custo do produto

		const discountAmount = 0; //parseFloat((cost * (per_discount / 100)).toFixed(2));

		const costWithDiscount = parseFloat((cost - discountAmount).toFixed(2));

		const per_profit = dados.per_profit ? parseFloat(dados.per_profit) : 0; // Custo do produto

		const desiredProfit = parseFloat((cost * (per_profit / 100)).toFixed(2)); // Lucro desejado

		const per_commission = dados.per_commission ? parseFloat(dados.per_commission) / 100 : 0; // Comissão do marketplace

		const per_taxes = dados.per_taxes ? parseFloat(dados.per_taxes) / 100 : 0; // Impostos

		const per_others = dados.per_others ? parseFloat(dados.per_others) / 100 : 0; // Outras porcentagens

		const shipping_cost = dados.shipping_cost ? parseFloat(dados.shipping_cost) : 0; // Custo do frete

		const fixed_rate = dados.fixed_rate ? parseFloat(dados.fixed_rate) : 0; // Custo do mk

		const logistic_cost = dados.logistic_cost ? parseFloat(dados.logistic_cost) : 0; // Custo fixo logistica

		// Total de porcentagens sobre o preço de venda
		const total_percentage = per_commission + per_taxes + per_others;

		// Calculando o preço de venda necessário para garantir o lucro desejado
		const finalSellingPrice =
			(costWithDiscount + desiredProfit + shipping_cost + fixed_rate + logistic_cost) / (1 - total_percentage);

		const totalSale = Math.floor(finalSellingPrice);
		const totalProfit = Math.floor(desiredProfit);

		return { totalSale, totalProfit };
	}
}
