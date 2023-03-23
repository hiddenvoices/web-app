import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateHelperComponent } from './generate-helper.component';

describe('GenerateHelperComponent', () => {
  let component: GenerateHelperComponent;
  let fixture: ComponentFixture<GenerateHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
