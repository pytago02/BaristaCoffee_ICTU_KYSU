import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ImportModule } from '../../../modules/import/import.module';
import { UrlbackendService } from '../../../services/urlbackend.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ShareDataService } from '../../../services/sharedata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order',
  imports: [ImportModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
  providers: [ConfirmationService, MessageService],
})
export class OrderComponent implements OnInit {
  // ===== DATA =====
  backendURL: any;
  orderData: any[] = [];
  filterOrderData: any[] = [];
  rangeDates: Date[] | undefined;
  keyword: string = '';
  keywordId: string = '';
  selectedOrderData: any = [];
  subscription: Subscription | undefined;

  // ===== SHOW LAYOUT =====
  isBackdropActive = false;

  constructor(
    private orderService: OrderService,
    private urlbackendService: UrlbackendService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private shareDataService: ShareDataService
  ) {
    this.backendURL = this.urlbackendService.urlBackend;
  }

  ngOnInit(): void {
    this.getAllOrder();
    this.getGoTo();
  }
  loadData() {
    this.getAllOrder();
  }

  resetShow() {
    this.isBackdropActive = false;
  }

  getGoTo() {
    this.shareDataService.currentMessage.subscribe(
      (message) => (this.keywordId = message)
    );
    console.log('nhan user_id:', this.keywordId);
  }

  resetTable(table: any) {
    table.clear();
    this.loadData();
  }

  getAllOrder() {
    this.orderService.getAllOrder().subscribe({
      next: (res) => {
        this.orderData = res;
        this.filterOrderData = res;
        console.log('getAllOrder:', this.orderData);

        if (this.keywordId) {
          this.searchById();
        }
      },
      error: (err) => {
        console.error('Error getAllOrder:', err);
      },
    });
  }

  selectedOrder(order: any) {
    if (this.selectedOrderData == order) {
      this.selectedOrderData = null;
      return;
    }
    console.log('selectedOrder:', order);
    this.selectedOrderData = order;
  }

  filterByRange() {
    if (!this.rangeDates || this.rangeDates.length < 2) {
      this.filterOrderData = [...this.orderData];
      return;
    }

    const startDate = new Date(this.rangeDates[0]);
    const endDate = new Date(this.rangeDates[1]);
    endDate.setHours(23, 59, 59, 999);

    // format YYYY-MM-DD
    const from = startDate.toISOString().split('T')[0];
    const to = endDate.toISOString().split('T')[0];

    this.orderService.getOrdersByRange(from, to).subscribe({
      next: (res) => {
        this.filterOrderData = res;
        console.log('filterByRange:', res);
      },
      error: (err) => {
        console.error('Error filterByRange:', err);
      },
    });
  }

  search() {
    const keywordLower = this.keyword.trim().toLowerCase();
    if (!keywordLower) {
      this.filterOrderData = [...this.orderData];
      return;
    }
    this.filterOrderData = this.orderData.filter(
      (order) =>
        order.customer_name.toLowerCase().includes(keywordLower) ||
        order.customer_phone.toLowerCase().includes(keywordLower)
    );
  }

  searchById() {
    if (!this.keywordId) {
      this.filterOrderData = [...this.orderData];
      return;
    }

    this.filterOrderData = this.orderData.filter((order) =>
      order.order_id.toString().includes(this.keywordId)
    );
  }

  clearFilter() {
    this.keyword = '';
    this.keywordId = '';
    this.rangeDates = [];
    this.getAllOrder();
  }

  stockSeverity(data: any) {
    if (data.status === 'pending') return 'warn';
    if (data.status === 'preparing') return 'secondary';
    if (data.status === 'completed') return 'info';
    if (data.status === 'cancell') return 'danger';
    if (data.status === 'paid') return 'success';
    return 'contrast';
  }

  statusMap: { [key: string]: { label: string; severity: string } } = {
    pending: { label: 'Chờ xử lý', severity: 'danger' },
    preparing: { label: 'Đang chuẩn bị', severity: 'secondary' },
    completed: { label: 'Hoàn tất', severity: 'info' },
    cancelled: { label: 'Đã hủy', severity: 'danger' },
    paid: { label: 'Đã thanh toán', severity: 'success' },
  };

  getStatusLabel(status: string): string {
    return this.statusMap[status]?.label || status;
  }
}
