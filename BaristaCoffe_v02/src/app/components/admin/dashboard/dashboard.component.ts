import { ChangeDetectorRef, Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { isPlatformBrowser } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [ImportModule, InputTextModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  revenueData: any;
  items: any[] = [];

  value: any;

  search(event: AutoCompleteCompleteEvent) {
    let _items = [...Array(10).keys()];

    this.items = event.query
      ? [...Array(10).keys()].map((item) => event.query + '-' + item)
      : _items;
  }
  // ===============================================================================================
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.initChart();
    this.initChartPie();
    this.initChartProduct();
  }

  // formAddExpense
  viewAddExpense = false;
  expenseData = {
    staff_salary: 0,
    eletricity_bill: 0,
    water_bill: 0,
    rent: 0,
    other: 0,
  }
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
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Dataset 1',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            yAxisID: 'y',
            tension: 0.4,
            data: [65, 59, 80, 81, 56, 55, 10],
          },
          {
            label: 'Dataset 2',
            fill: false,
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            yAxisID: 'y1',
            tension: 0.4,
            data: [28, 48, 40, 19, 86, 27, 90],
          },
        ],
      };

      this.options = {
        stacked: false,
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
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
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              drawOnChartArea: false,
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

  initChartPie() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.dataPie = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            data: [540, 325, 702],
            backgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-500'),
              documentStyle.getPropertyValue('--p-orange-500'),
              documentStyle.getPropertyValue('--p-gray-500'),
            ],
            hoverBackgroundColor: [
              documentStyle.getPropertyValue('--p-cyan-400'),
              documentStyle.getPropertyValue('--p-orange-400'),
              documentStyle.getPropertyValue('--p-gray-400'),
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
        },
      };
      this.cd.markForCheck();
    }
  }

  // bieudoProduct
  dataProduct: any;
  optionsProduct: any;

  // platformId = inject(PLATFORM_ID);
  // configService = inject(AppConfigService);
  // designerService = inject(DesignerService);
  // themeEffect = effect(() => {
  //     if (this.configService.transitionComplete()) {
  //         if (this.designerService.preset()) {
  //             this.initChart();
  //         }
  //     }
  // });

  initChartProduct() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      this.dataProduct = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
            borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
            data: [65, 59, 80, 81, 56, 55, 40],
          },
          {
            label: 'My Second dataset',
            backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
            borderColor: documentStyle.getPropertyValue('--p-gray-500'),
            data: [28, 48, 40, 19, 86, 27, 90],
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
  }
}
