import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewRegistrationsComponent } from './approve-new-registration.component';

describe('ApproveNewRegistrationComponent', () => {
  let component: ApproveNewRegistrationsComponent;
  let fixture: ComponentFixture<ApproveNewRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveNewRegistrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveNewRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
