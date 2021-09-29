import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequestListingComponent } from './create-request-listing.component';

describe('CreateRequestListingComponent', () => {
  let component: CreateRequestListingComponent;
  let fixture: ComponentFixture<CreateRequestListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRequestListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRequestListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
