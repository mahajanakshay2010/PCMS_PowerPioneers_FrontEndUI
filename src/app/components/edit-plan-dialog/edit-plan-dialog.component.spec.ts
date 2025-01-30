import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanDialogComponent } from './edit-plan-dialog.component';

describe('EditPlanDialogComponent', () => {
  let component: EditPlanDialogComponent;
  let fixture: ComponentFixture<EditPlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPlanDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
