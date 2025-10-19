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
    
    this.socket.on('connect', () => {
      console.log('🟢 Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Socket disconnected');
    });
  }

  // Lắng nghe sự kiện order mới
  onNewOrder(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('orderCreated', (data) => {
        subscriber.next(data);
      });
    });
  }

  // Khi khách gọi nhân viên
  onStaffCalled(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('staffCalled', (data) => {
        subscriber.next(data);
      });
    });
  }

  // Khi khách yêu cầu thanh toán
  onPaymentRequested(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('paymentRequested', (data) => {
        subscriber.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }
}
