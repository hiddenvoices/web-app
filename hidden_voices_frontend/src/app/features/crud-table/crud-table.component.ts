import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
})
export class CrudTableComponent implements OnInit, OnChanges {
  @Input() items: any[] = [];
  @Input() cols: number = 30;
  @Output() itemsChange = new EventEmitter<any>();
  item: any;
  selectedItems: any[] | null = null;
  submitted: boolean = false;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ngxCsvParser: NgxCsvParser
  ) {}

  ngOnInit() {
    if (this.items.length) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].id = this.createId();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.items.length) {
      for (let i = 0; i < this.items.length; i++) {
        this.items[i].id = this.createId();
      }
    }
  }

  result: any[] | NgxCSVParserError = [];
  loadCSV(event: any, fileUpload: any) {
    this.ngxCsvParser
      .parse(event.files[0], {
        header: true,
        delimiter: ',',
        encoding: 'utf8',
      })
      .pipe()
      .subscribe({
        next: (result): void => {
          if (Array.isArray(result)) {
            this.items = result;
          }
        },
        error: (error: NgxCSVParserError): void => {
          this.messageService.add({
            severity: 'error',
            summary: 'Failed',
            detail: 'Failed to load file',
            life: 3000,
          });
        },
        complete: () => {
          for (let i = 0; i < this.items.length; i++) {
            this.items[i].id = this.createId();
          }
          this.itemsChange.emit(this.items);
        },
      });
    fileUpload.clear();
  }

  openNew() {
    this.item = { text: '', source: '', id: this.createId() };
    this.items.push(this.item);
    this.itemsChange.emit(this.items);
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected items?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = this.items.filter(
          (val) => !this.selectedItems?.includes(val)
        );
        this.itemsChange.emit(this.items);
        this.selectedItems = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Deleted',
          life: 3000,
        });
      },
    });
  }

  deleteItem(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the item?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.items = this.items.filter((val) => val.id !== item.id);
        this.item = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Deleted',
          life: 3000,
        });
        this.itemsChange.emit(this.items);
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  exportToCSV() {
    let filename = 'data.csv';
    if (!this.items || !this.items.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(this.items[0]);
    keys.splice(keys.length - 1, 1);
    const csvData =
      keys.join(separator) +
      '\n' +
      this.items
        .map((row: any) => {
          return keys
            .filter((k) => k != 'id')
            .map((k) => {
              let cell = row[k] === null || row[k] === undefined ? '' : row[k];
              cell =
                cell instanceof Date
                  ? cell.toLocaleString()
                  : cell.toString().replace(/"/g, '""');
              if (cell.search(/("|,|\n)/g) >= 0) {
                cell = `"${cell}"`;
              }
              return cell;
            })
            .join(separator);
        })
        .join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
}
