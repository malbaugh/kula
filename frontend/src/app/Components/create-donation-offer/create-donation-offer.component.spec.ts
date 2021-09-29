import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDonationOfferComponent } from './create-donation-offer.component';

describe('CreateDonationOfferComponent', () => {
  let component: CreateDonationOfferComponent;
  let fixture: ComponentFixture<CreateDonationOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDonationOfferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDonationOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
