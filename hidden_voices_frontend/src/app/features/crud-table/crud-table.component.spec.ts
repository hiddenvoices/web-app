import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTableComponent } from './crud-table.component';

describe('CrudTableComponent', () => {
  let component: CrudTableComponent;
  let fixture: ComponentFixture<CrudTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
