import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPlansComponent } from './search-plans.component';

describe('SearchPlansComponent', () => {
  let component: SearchPlansComponent;
  let fixture: ComponentFixture<SearchPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
