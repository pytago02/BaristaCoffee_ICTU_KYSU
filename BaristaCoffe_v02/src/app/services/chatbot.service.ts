import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UrlbackendService } from './urlbackend.service';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  time?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = '';
  private chatHistoryKey = 'chat_history';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private urlBackendService: UrlbackendService
  ) {
    this.apiUrl = `${this.urlBackendService.urlBackend}/chatbot/ask`
    this.loadChatHistory();
  }

  /** 📩 Gửi tin nhắn tới chatbot */
  // sendMessage(message: string, userName: string = 'guest'): Observable<any> {
  //   const payload = { message, user: userName };
  //   return this.http.post<{ reply: string }>(this.apiUrl, payload);
  // }
  sendMessage(message: string, userName: string = 'guest'): Observable<any> {
  const payload = { message, user: userName };
  return this.http.post<{ type: string; reply: string; items?: any[] }>(
    this.apiUrl,
    payload
  );
}


  /** 💬 Thêm tin nhắn mới vào bộ nhớ (hiển thị + lưu localStorage) */
  addMessage(msg: ChatMessage): void {
    const current = this.messagesSubject.value;
    const updated = [...current, { ...msg, time: new Date().toISOString() }];
    this.messagesSubject.next(updated);
    localStorage.setItem(this.chatHistoryKey, JSON.stringify(updated));
  }

  /** 🧠 Tải lịch sử chat từ localStorage */
  loadChatHistory(): void {
    const saved = localStorage.getItem(this.chatHistoryKey);
    if (saved) {
      this.messagesSubject.next(JSON.parse(saved));
    }
  }

  /** 🗑 Xóa toàn bộ lịch sử chat */
  clearHistory(): void {
    this.messagesSubject.next([]);
    localStorage.removeItem(this.chatHistoryKey);
  }
}
