import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WikipediaGenerationService {
  private serviceCounter: BehaviorSubject<number>;

  constructor(private httpClient: HttpClient) {
    this.serviceCounter = new BehaviorSubject<number>(0);
  }

  BACKEND_URL = 'http://localhost:8000/backend/wiki';

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

  public incrementServiceCounter(): void {
    this.serviceCounter.next(this.serviceCounter.value + 1);
  }

  public decrementServiceCounter(): void {
    this.serviceCounter.next(this.serviceCounter.value - 1);
  }

  public getServiceCounter(): Observable<number> {
    return this.serviceCounter.asObservable();
  }
}
