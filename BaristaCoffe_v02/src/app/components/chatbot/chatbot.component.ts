import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { ImportModule } from '../../modules/import/import.module';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { UsersService } from '../../services/user.service';
import { UrlbackendService } from '../../services/urlbackend.service';

@Component({
  selector: 'app-chatbot',
  imports: [ImportModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent implements AfterViewChecked {
  inputText = '';
  messages: ChatMessage[] = [];
  userData: any;
  urlBackend = '';

  @ViewChild('chatBody') private chatBodyRef!: ElementRef;

  constructor(
    private chatbotService: ChatbotService,
    private usersService: UsersService,
    private urlbackendService: UrlbackendService
  ) {
    this.chatbotService.messages$.subscribe((msgs) => {
      this.messages = msgs;
      // Cuộn sau 1 tick để đảm bảo DOM render xong
      setTimeout(() => this.scrollToBottom(), 100);
    });

    this.urlBackend = urlbackendService.urlBackend;
    this.getMe();
  }

  getMe() {
    this.usersService.getMe().subscribe({
      next: (res) => {
        this.userData = res.data;
      },
      error: (err) => {
        console.error('error getMe: ', err);
      },
    });
  }

  /** 🧭 Cuộn xuống tin nhắn mới nhất */
  private scrollToBottom(): void {
    try {
      const el = this.chatBodyRef?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      console.warn('Không thể cuộn xuống cuối:', err);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    this.chatbotService.addMessage({ sender: 'user', text });

    this.chatbotService.sendMessage(text, 'guest').subscribe({
      next: (res) => {
        const reply = res.reply || 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn.';
        this.chatbotService.addMessage({ sender: 'bot', text: reply });
      },
      error: () => {
        this.chatbotService.addMessage({
          sender: 'bot',
          text: '❌ Không thể kết nối với chatbot. Vui lòng thử lại sau.',
        });
      },
    });

    this.inputText = '';
  }

  clearChat(): void {
    this.chatbotService.clearHistory();
  }
}
