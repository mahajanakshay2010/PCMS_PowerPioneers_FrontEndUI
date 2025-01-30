import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningpopupComponent } from './warningpopup.component';

describe('WarningpopupComponent', () => {
  let component: WarningpopupComponent;
  let fixture: ComponentFixture<WarningpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WarningpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarningpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
