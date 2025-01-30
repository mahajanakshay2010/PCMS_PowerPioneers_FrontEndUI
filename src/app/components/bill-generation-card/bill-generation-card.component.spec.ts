import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillGenerationCardComponent } from './bill-generation-card.component';

describe('BillGenerationCardComponent', () => {
  let component: BillGenerationCardComponent;
  let fixture: ComponentFixture<BillGenerationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillGenerationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillGenerationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
