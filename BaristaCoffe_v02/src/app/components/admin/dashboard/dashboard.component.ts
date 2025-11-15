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

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [ImportModule, InputTextModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  urlBackend = '';
  revenueData: any;
  items: any[] = [];

  value: any;

  search(event: AutoCompleteCompleteEvent) {
    let _items = [...Array(10).keys()];

    this.items = event.query
      ? [...Array(10).keys()].map((item) => event.query + '-' + item)
      : _items;
  }

  businessData: any[] = [];
  businessDataNowMonth: any[] = [];

  selectedDate: Date = new Date();
  predictData: any;
  quantityOrderItemsData: any;

  // ===============================================================================================
  constructor(
    private cd: ChangeDetectorRef,
    private businessService: BusinessService,
    private messageService: MessageService,
    private urlBackendService: UrlbackendService
  ) {
    this.urlBackend = this.urlBackendService.urlBackend;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadAllBusiness();
    this.initChart();
    this.getRevenueByCategory(
      this.selectedDate.getMonth() + 1,
      this.selectedDate.getFullYear()
    );

    this.forecasts();
    this.getQuantityOrderItems();
    this.getBusinessToday();
  }

  loadAllBusiness() {
    this.businessService.getAllBusiness().subscribe({
      next: (data) => {
        this.businessData = [...data];
        console.log('businessData:', this.businessData);
        this.filterBusinessNowMonth();
        this.initChart();
      },
      error: (err) => {
        console.error('err getAllBusiness:', err);
      },
    });
  }

  filterBusinessNowMonth() {
    this.businessDataNowMonth = this.businessData.filter((item: any) => {
      return (
        item.month === this.selectedDate.getMonth() + 1 &&
        item.year === this.selectedDate.getFullYear()
      );
    }).slice(0,1);
    console.log('businessDataNowMounth:', this.businessDataNowMonth);
  }

  updateBusiness(item: any) {
    const dataUpdate = {
      staff_salary: item.staff_salary,
      eletricity_bill: item.eletricity_bill,
      water_bill: item.water_bill,
      rent: item.rent,
      other: item.other,
      month: item.month,
      year: item.year,
    };

    this.businessService.updateBusiness(dataUpdate).subscribe({
      next: (res) => {
        console.log('Update success:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Cập nhật thành công!',
        });
        this.loadAllBusiness();
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Cập nhật thất bại!');
      },
    });
  }

  getRevenueByCategory(month: number, year: number) {
    this.businessService.getRevenueByCategory(month, year).subscribe({
      next: (data) => {
        console.log('Revenue by category:', data);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        // Chuyển dữ liệu API thành mảng label và data
        const labels = data.map((item: any) => item.category_name);
        const revenues = data.map((item: any) => Number(item.total_revenue));

        this.dataPie = {
          labels: labels,
          datasets: [
            {
              data: revenues,
              backgroundColor: [
                documentStyle.getPropertyValue('--p-cyan-500'),
                documentStyle.getPropertyValue('--p-orange-500'),
                documentStyle.getPropertyValue('--p-green-500'),
                documentStyle.getPropertyValue('--p-purple-500'),
                documentStyle.getPropertyValue('--p-pink-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--p-cyan-400'),
                documentStyle.getPropertyValue('--p-orange-400'),
                documentStyle.getPropertyValue('--p-green-400'),
                documentStyle.getPropertyValue('--p-purple-400'),
                documentStyle.getPropertyValue('--p-pink-400'),
              ],
            },
          ],
        };

        this.optionsPie = {
          plugins: {
            legend: {
              labels: {
                usePointStyle: true,
                color: textColor,
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return `${label}: ${value.toLocaleString('vi-VN')}₫`;
                },
              },
            },
          },
        };

        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching revenue by category:', err);
      },
    });
  }

  // formAddExpense
  viewAddExpense = false;
  expenseData = {
    staff_salary: 0,
    eletricity_bill: 0,
    water_bill: 0,
    rent: 0,
    other: 0,
  };
  addExpense() {}

  // bieu do charRevenue
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);

  // configService = inject(AppConfigService);
  // designerService = inject(DesignerService);
  // themeEffect = effect(() => {
  //   if (this.configService.transitionComplete()) {
  //     if (this.designerService.preset()) {
  //       this.initChart();
  //     }
  //   }
  // });

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );

      // === Dữ liệu động từ businessData ===
      const labels = this.businessData.map(
        (item) => `T${item.month}/${item.year}`
      );
      const revenueData = this.businessData.map((item) => item.revenue);
      const profitData = this.businessData.map((item) => item.net_profit);

      this.data = {
        labels,
        datasets: [
          {
            label: 'Doanh thu (₫)',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            backgroundColor: documentStyle.getPropertyValue('--p-cyan-200'),
            tension: 0.4,
            data: revenueData,
          },
          {
            label: 'Lợi nhuận (₫)',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-green-500'),
            backgroundColor: documentStyle.getPropertyValue('--p-green-200'),
            tension: 0.4,
            data: profitData,
          },
        ],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: any) =>
                `${context.dataset.label}: ${context.parsed.y.toLocaleString(
                  'vi-VN'
                )}₫`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
              callback: (value: number) => value.toLocaleString('vi-VN') + '₫',
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      this.cd.markForCheck();
    }
  }

  // bieu do charPie
  dataPie: any;
  optionsPie: any;
  // platformId = inject(PLATFORM_ID);
  // configService = inject(AppConfigService);
  // designerService = inject(DesignerService);
  // themeEffect = effect(() => {
  //   if (this.configService.transitionComplete()) {
  //     if (this.designerService.preset()) {
  //       this.initChart();
  //     }
  //   }
  // });

  // initChartPie() {
  //   this.dataPie = {
  //     labels: [],
  //     datasets: [
  //       {
  //         data: [],
  //       },
  //     ],
  //   };
  // }
  dataProduct: any;
  optionsProduct: any;

  forecasts() {
    this.businessService.getForecasts().subscribe({
      next: (res) => {
        this.predictData = res;
        console.log('predictData:', this.predictData);
      },
      error: (err) => {
        console.error('Get forecasts failed:', err);
      },
    });
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
          this.updateProductChart();
        },
        error: (err) => {
          console.error('Error fetching quantity order items:', err);
        },
      });
  }

  updateProductChart() {
    if (!this.quantityOrderItemsData || !isPlatformBrowser(this.platformId))
      return;

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--p-text-muted-color'
    );
    const surfaceBorder = documentStyle.getPropertyValue(
      '--p-content-border-color'
    );

    // 👉 Lấy dữ liệu từ API
    const labels = this.quantityOrderItemsData.map(
      (item: any) => item.menu_name
    );
    const quantities = this.quantityOrderItemsData.map((item: any) =>
      Number(item.total_quantity_ordered)
    );

    const colorPalette = [
      documentStyle.getPropertyValue('--p-cyan-300'),
      documentStyle.getPropertyValue('--p-green-300'),
      documentStyle.getPropertyValue('--p-orange-300'),
      documentStyle.getPropertyValue('--p-pink-300'),
      documentStyle.getPropertyValue('--p-purple-300'),
      documentStyle.getPropertyValue('--p-blue-300'),
      documentStyle.getPropertyValue('--p-yellow-300'),
      documentStyle.getPropertyValue('--p-teal-300'),
      documentStyle.getPropertyValue('--p-indigo-300'),
    ];
    const colors = quantities.map(
      (_: any, i: number) => colorPalette[i % colorPalette.length]
    );

    // 👉 Cấu hình chart
    this.dataProduct = {
      labels: labels,
      datasets: [
        {
          label: 'Số lượng sản phẩm được order',
          backgroundColor: colors,
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: quantities,
        },
      ],
    };

    this.optionsProduct = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.y || 0;
              return `Số lượng: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            precision: 0,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.cd.markForCheck();
  }

  businessDataToDay: any;
  getBusinessToday(){
    this.businessService.getBusinessToday().subscribe({
      next: (data) =>{
        this.businessDataToDay = {...data};
        console.log('businessDataToday:', this.businessDataToDay);
      },
      error: (err)=>{
        console.error('error getBusinessToday:', err);
      }
    })
  }
}
