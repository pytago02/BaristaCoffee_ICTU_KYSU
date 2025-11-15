import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../../../services/business.service';
import { MessageService } from 'primeng/api';
import { UrlbackendService } from '../../../services/urlbackend.service';

@Component({
  selector: 'app-analytics',
  imports: [ImportModule, InputTextModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  providers: [MessageService],
})
export class AnalyticsComponent implements OnInit {
  urlBackend = '';
  selectedDate: Date = new Date();
  quantityOrderItemsData: any;

  constructor(
    private cd: ChangeDetectorRef,
    private businessService: BusinessService,
    private messageService: MessageService,
    private urlBackendService: UrlbackendService
  ) {
    this.urlBackend = this.urlBackendService.urlBackend;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getQuantityOrderItems();
    this.getHotTables();
  }

  getQuantityOrderItems() {
    this.businessService
      .getQuantityOrderItems(
        this.selectedDate.getMonth() + 1,
        this.selectedDate.getFullYear()
      )
      .subscribe({
        next: (data) => {
          this.quantityOrderItemsData = data;
          console.log('Quantity Order Items:', this.quantityOrderItemsData);
          // this.updateProductChart();
          this.getQuantityItemByMonth();
        },
        error: (err) => {
          console.error('Error fetching quantity order items:', err);
        },
      });
  }

  hotTablesData: any;
  getHotTables() {
    this.businessService
      .getHotTables(
        this.selectedDate.getMonth() + 1,
        this.selectedDate.getFullYear()
      )
      .subscribe({
        next: (data) => {
          this.hotTablesData = data;
          console.log('hotTablesData:', this.hotTablesData);
        },
        error: (err) => {
          console.error('error getHotTables:', err);
        },
      });
  }

  quantityItemByMonthData: any;
  getQuantityItemByMonth() {
    this.businessService
      .getQuantityItemByMonth(this.quantityOrderItemsData[0].menu_id)
      .subscribe({
        next: (data) => {
          this.quantityItemByMonthData = data;
          console.log('quantityItemByMonth:', this.quantityItemByMonthData);
          this.loadQuantityChart();
        },
        error: (err) => {
          console.error('error getQuantityItemByMonth:', err);
        },
      });
  }

  chartData: any;
  chartOptions: any;
  loadQuantityChart() {
    // Sắp xếp theo tháng tăng dần
    const labels = this.quantityItemByMonthData.map(
      (item: any) => `Tháng ${item.month}/${item.year}`
    );
    const data = this.quantityItemByMonthData.map((item: any) =>
      Number(item.total_quantity)
    );

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: this.quantityItemByMonthData[0]?.menu_name || 'Sản phẩm',
          data: data,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.3,
        },
      ],
    };

    this.chartOptions = {
      // maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: 'Số lượng sản phẩm theo tháng',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Mỗi bước = 1 đơn vị
            precision: 0, // Không có số thập phân
          },
        },
      },
    };
  }
}
