import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetQrComponent } from './get-qr.component';

describe('GetQrComponent', () => {
  let component: GetQrComponent;
  let fixture: ComponentFixture<GetQrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetQrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
