import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlbackendService {
  constructor() {}
  public urlBackend = 'http://localhost:3000';
  public urlFrontend = 'http://localhost:4200';
}
