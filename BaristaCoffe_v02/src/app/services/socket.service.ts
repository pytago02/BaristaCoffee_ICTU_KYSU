import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('http://localhost:3000');
  // private socket: any;

  constructor(private urlBackendService: UrlbackendService) {
    this.socket = io(`${this.urlBackendService.urlBackend}`);
  }

  // Lắng nghe sự kiện order mới
  onNewOrder(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('orderCreated', (data) => {
        subscriber.next(data);
      });
    });
  }
}
