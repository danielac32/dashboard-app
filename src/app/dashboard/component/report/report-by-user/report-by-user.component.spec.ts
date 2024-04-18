import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportByUserComponent } from './report-by-user.component';

describe('ReportByUserComponent', () => {
  let component: ReportByUserComponent;
  let fixture: ComponentFixture<ReportByUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportByUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
