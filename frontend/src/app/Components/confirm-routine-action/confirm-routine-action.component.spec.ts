import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRoutineActionComponent } from './confirm-routine-action.component';

describe('ConfirmRoutineActionComponent', () => {
  let component: ConfirmRoutineActionComponent;
  let fixture: ComponentFixture<ConfirmRoutineActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRoutineActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRoutineActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
