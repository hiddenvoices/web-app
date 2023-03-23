import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoidsComponent } from './factoids.component';

describe('FactoidsComponent', () => {
  let component: FactoidsComponent;
  let fixture: ComponentFixture<FactoidsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoidsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
