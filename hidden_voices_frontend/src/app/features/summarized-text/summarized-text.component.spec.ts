import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedTextComponent } from './summarized-text.component';

describe('SummarizedTextComponent', () => {
  let component: SummarizedTextComponent;
  let fixture: ComponentFixture<SummarizedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummarizedTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
