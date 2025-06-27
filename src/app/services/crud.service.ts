import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  path = '';
  baseUrl = environment.url;

  constructor(private http: HttpClient) {}

  getBaseUrl() {
    return `${this.baseUrl}/${this.path}`;
  }

  listing(queryParams: any = {}): Promise<any> {
    return lastValueFrom(
      this.http.get(`${this.getBaseUrl()}`, { params: queryParams })
    );
  }
  create(data: any): Promise<any> {
    return lastValueFrom(this.http.post(`${this.getBaseUrl()}`, data));
  }
  show(id: any): Promise<any> {
    return lastValueFrom(this.http.get(`${this.getBaseUrl()}/${id}`));
  }
  update(data: any, id: any): Promise<any> {
    return lastValueFrom(this.http.put(`${this.getBaseUrl()}/${id}`, data));
  }
  delete(id: any): Promise<any> {
    return lastValueFrom(this.http.delete(`${this.getBaseUrl()}/${id}`));
  }

  getCustom(path: string, data: any = {}): Promise<any> {
    return lastValueFrom(
      this.http.get(`${this.baseUrl}/${path}`, { params: data })
    );
  }
  postCustom(path: string, data: any = {}): Promise<any> {
    return lastValueFrom(this.http.post(`${this.baseUrl}/${path}`, data));
  }
  updateCustom(path: string, data: any = {}): Promise<any> {
    return lastValueFrom(this.http.put(`${this.baseUrl}/${path}`, data));
  }
  deleteCustom(path: string, data: any = {}): Promise<any> {
    return lastValueFrom(this.http.delete(`${this.baseUrl}/${path}`, data));
  }

  fetchOptions(path: string, params: any = {}): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/${path}`, { params })
      .pipe(
        map((data: any) =>
          data.map((item: any) => ({ id: item.id, text: item.text }))
        )
      );
  }

  async getByCep(cep: string) {
    if (cep.length < 8) {
      return;
    }
    cep = cep.replace(/\D/g, '');
    const result = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return await result.json();
  }

  download(route: string, name: string) {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };

    return this.http.get(`${route}`, httpOptions).subscribe((data: any) => {
      const blob = new Blob([data]);

      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = name;
      link.click();
      link.remove();
    });
  }
}
