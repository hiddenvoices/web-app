import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WikipediaGenerationService {
  constructor(private httpClient: HttpClient) {}

  BACKEND_URL = 'http://127.0.0.1:8000/wiki';

  public scrape(name: string) {
    const body = {
      name: name,
    };
    return this.httpClient.post(`${this.BACKEND_URL}/scrape/`, body);
  }

  public extract(name: string, content: string) {
    const body = {
      name: name,
      content: content,
    };
    return this.httpClient.post(`${this.BACKEND_URL}/extract/`, body);
  }

  public summarize(name: string, triples: string) {
    const body = {
      name: name,
      triples: triples,
    };
    return this.httpClient.post(`${this.BACKEND_URL}/summarize/`, body);
  }
}
