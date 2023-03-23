import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapedTextComponent } from './scraped-text.component';

describe('ScrapedTextComponent', () => {
  let component: ScrapedTextComponent;
  let fixture: ComponentFixture<ScrapedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrapedTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrapedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
