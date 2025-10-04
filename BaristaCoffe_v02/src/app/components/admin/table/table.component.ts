import { ZoneService } from '../../../services/zone.service';
import {
  ChangeDetectorRef,
  Component,
  effect,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ImportModule } from '../../../modules/import/import.module';
import { TableService } from '../../../services/table.service';
import { Observable, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UrlbackendService } from '../../../services/urlbackend.service';

export interface TableData {
  table_id: number;
  table_name: string;
  table_status: string;
  zone: {
    zone_id: number;
    zone_name: string;
  };
  orders: {
    order_id: number;
    status: string;
    total_price: number;
    payment_method: string | null;
    created_at: string;
    customer: {
      user_id: number;
      full_name: string;
    } | null;
    items: {
      order_item_id: number;
      quantity: number;
      price: number;
      note: string | null;
      menu: {
        menu_id: number;
        name: string;
        price: number;
        image_url: string;
      };
    }[];
  }[];
}

@Component({
  selector: 'app-table',
  imports: [ImportModule, ReactiveFormsModule, ChartModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [ConfirmationService, MessageService],
})
export class TableComponent implements OnInit {
  tableData: any;
  status: string = 'available';
  tableId: number | undefined;
  // zoneData$: Observable<any> | undefined;
  urlFrontEnd = '';
  zonesData: any;
  zones: any;
  showCreateTableForm = false;
  showCreateZoneForm = false;
  statusOptions = [
    { label: 'Sẵn sàng', value: 'available' },
    { label: 'Đang chờ', value: 'waiting' },
    { label: 'Đã phục vụ', value: 'served' },
    { label: 'Đã thanh toán', value: 'paid' },
    { label: 'Không khả dụng', value: 'unavailable' },
  ];

  selectedTableData: any;
  showEditTable = false;
  qrData = '';

  constructor(
    private tablesService: TableService,
    private zonesService: ZoneService,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private urlbackendService: UrlbackendService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // this.zoneData$ = this.tablesService.getAllZonesWithTables();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    }

    this.cd.detectChanges();
  }

  loadData() {
    this.urlFrontEnd = this.urlbackendService.urlFrontend;
    this.getAllTables();
    this.getAllZones();
    this.initChart();
    this.getAllZonesWithTables();
    // this.zoneData$ = this.tablesService.getAllZonesWithTables();
    this.zonesService.getAllZones().subscribe({
      next: (data) => (this.zones = data),
      error: (err) => console.error('Lỗi khi lấy zone:', err),
    });
  }

  // === table ===
  getAllTables(): void {
    this.tablesService.getAllTables().subscribe((data) => {
      this.tableData = data;
      console.log('tableData:', this.tableData);
    });
  }

  getAllTablesByStatus(status: string): void {
    this.tablesService.getAllTablesByStatus(status).subscribe((data) => {
      console.log(`${status} tables:`, data);
    });
  }

  getTableById(tableId: number): void {
    this.tablesService.getTableById(tableId).subscribe((data) => {
      console.log('tableData by ID:', data);
      this.selectedTableData = data;
      this.showEditTable = true; // chỉ show khi đã có dữ liệu
      this.cd.detectChanges(); // ép Angular cập nhật lại
    });
  }

  getAllZonesWithTables() {
    this.tablesService.getAllZonesWithTables().subscribe({
      next: (res) => {
        this.zonesData = res;
        console.log('zonesData:', res);
      },
      error: (err) => {
        console.error('error getAllZonesWithTables:', err);
      },
    });
  }

  saveTable() {
    this.tablesService
      .updateTable(this.selectedTableData.table_id, {
        table_name: this.selectedTableData.table_name,
        zone_id: this.selectedTableData.zone.zone_id,
        table_status: this.selectedTableData.table_status,
      })
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật bàn thành công',
          });
          this.loadData();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Cập nhật thất bại',
          });
        },
      });
  }

  deleteTable() {
    if (confirm('Bạn có chắc muốn xoá bàn này?')) {
      this.tablesService
        .deleteTable(this.selectedTableData.table_id)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xoá bàn',
            });
            this.loadData();
            this.showEditTable = false;
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xoá bàn',
            });
          },
        });
    }
  }
  // === zone ===
  zoneData: any;
  getAllZones(): void {
    this.zonesService.getAllZones().subscribe((data) => {
      this.zoneData = data;
      console.log('zoneData:', this.zoneData);
    });
  }

  message: string = '';
  formCreateTable = new FormGroup({
    table_name: new FormControl(''),
    zone_id: new FormControl(''),
  });

  formCreateZone = new FormGroup({
    zone_name: new FormControl(''),
  });

  createZone(): void {
    if (this.formCreateZone.valid) {
      const payload = {
        zone_name: this.formCreateZone.value.zone_name ?? '',
      };

      this.zonesService.createZone(payload).subscribe({
        next: () => {
          this.message = 'Tạo khu vực thành công!';
          this.getAllZones();
          this.getAllZonesWithTables();
          // this.zoneData$ = this.tablesService.getAllZonesWithTables();
          this.formCreateZone.reset();
          this.showCreateZoneForm = false;
          this.loadData();
        },
        error: (err) => {
          console.error('Lỗi khi tạo khu vực:', err);
          this.message = 'Tạo khu vực thất bại!';
        },
      });
    } else {
      this.message = 'Tên khu vực không được để trống!';
    }
  }

  onSubmit(): void {
    if (this.formCreateTable.valid) {
      this.tablesService.createTable(this.formCreateTable.value).subscribe({
        next: (res) => {
          this.message = 'Tạo bàn thành công!';
          this.getAllTables();
          this.getAllZonesWithTables();
          // this.zoneData$ = this.tablesService.getAllZonesWithTables();
          this.formCreateTable.reset();
          this.showCreateTableForm = false;
        },
        error: (err) => {
          console.error('Lỗi khi tạo bàn:', err);
          this.message = 'Tạo bàn thất bại!';
        },
      });
    } else {
      this.message = 'Vui lòng nhập đầy đủ thông tin!';
    }
  }

  editingZone: any = null;

  editZone(zone: any) {
    this.editingZone = { ...zone };
  }
  cancelEdit() {
    this.editingZone = null;
  }

  saveZone() {
    this.zonesService
      .updateZone(this.editingZone.zone_id, {
        zone_name: this.editingZone.zone_name,
      })
      .subscribe({
        next: () => {
          this.getAllZones();
          this.getAllZonesWithTables();
          // this.zoneData$ = this.tablesService.getAllZonesWithTables();
          this.editingZone = null;
        },
        error: (err) => console.error('Lỗi cập nhật zone:', err),
      });
  }

  deleteZone(id: number) {
    if (confirm('Bạn có chắc chắn muốn xoá khu vực này không?')) {
      this.zonesService.deleteZone(id).subscribe({
        next: () => {
          this.getAllZones();
          this.getAllZonesWithTables();
        },
        error: (err) => console.error('Lỗi xoá khu vực:', err),
      });
    }
  }

  // chart
  basicData: any;
  basicOptions: any;
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

      this.basicData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          {
            label: 'Bàn',
            data: [540, 325, 702, 620],
            backgroundColor: [
              'rgba(249, 115, 22, 0.2)',
              'rgba(6, 182, 212, 0.2)',
              'rgb(107, 114, 128, 0.2)',
              'rgba(139, 92, 246, 0.2)',
            ],
            borderColor: [
              'rgb(249, 115, 22)',
              'rgb(6, 182, 212)',
              'rgb(107, 114, 128)',
              'rgb(139, 92, 246)',
            ],
            borderWidth: 1,
          },
        ],
      };

      this.basicOptions = {
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
            beginAtZero: true,
            ticks: {
              color: textColorSecondary,
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

  // select table
  selectedTable(table: any) {
    console.log(table);
    this.tablesService.getTableById(table.table_id).subscribe({
      error: (err) => {
        console.error('Lỗi lấy table by id: ', err);
      },
      next: (data) => {
        this.selectedTableData = data;
        this.showEditTable = true;
        console.log('selectedTableData: ', this.selectedTableData);
        this.qrData = `${this.urlFrontEnd}/customer/?table_id=${this.selectedTableData.table_id}`;
        console.log(this.qrData);
        this.cd.detectChanges();
      },
    });
  }

}
