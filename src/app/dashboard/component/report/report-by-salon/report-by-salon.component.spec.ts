import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBySalonComponent } from './report-by-salon.component';

describe('ReportBySalonComponent', () => {
  let component: ReportBySalonComponent;
  let fixture: ComponentFixture<ReportBySalonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBySalonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportBySalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
