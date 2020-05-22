import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTcComponent } from './dialog-tc.component';

describe('DialogTcComponent', () => {
  let component: DialogTcComponent;
  let fixture: ComponentFixture<DialogTcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
