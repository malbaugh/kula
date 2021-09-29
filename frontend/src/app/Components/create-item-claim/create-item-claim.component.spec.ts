import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemClaimComponent } from './create-item-claim.component';

describe('CreateItemClaimComponent', () => {
  let component: CreateItemClaimComponent;
  let fixture: ComponentFixture<CreateItemClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateItemClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateItemClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
