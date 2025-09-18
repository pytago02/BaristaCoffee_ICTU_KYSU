import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlbackendService {
  constructor() {}
  urlBackend = 'http://localhost:3000';
  urlFrontend = 'http://localhost:4200';
}
