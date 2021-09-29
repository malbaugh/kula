import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemListingComponent } from './create-item-listing.component';

describe('CreateItemListingComponent', () => {
  let component: CreateItemListingComponent;
  let fixture: ComponentFixture<CreateItemListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
