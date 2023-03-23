import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css'],
})
export class CrudTableComponent implements OnInit {
  @Input() items: any[] = [];
  itemDialog: boolean = false;
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
        },
      });
    fileUpload.clear();
  }

  openNew() {
    this.item = {};
    this.submitted = false;
    this.itemDialog = true;
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

  editItem(item: any) {
    this.item = { ...item };
    this.itemDialog = true;
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
      },
    });
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
  }

  saveItem() {
    this.submitted = true;

    if (this.item.text.trim()) {
      if (this.item.id) {
        this.items[this.findIndexById(this.item.id)] = this.item;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Updated',
          life: 3000,
        });
      } else {
        this.item.id = this.createId();
        this.items.push(this.item);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Item Created',
          life: 3000,
        });
      }

      this.items = [...this.items];
      this.itemDialog = false;
      this.item = {};
    }
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
