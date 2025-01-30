import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeWarningDialogComponent } from './unsubscribe-warning-dialog.component';

describe('UnsubscribeWarningDialogComponent', () => {
  let component: UnsubscribeWarningDialogComponent;
  let fixture: ComponentFixture<UnsubscribeWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsubscribeWarningDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsubscribeWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
