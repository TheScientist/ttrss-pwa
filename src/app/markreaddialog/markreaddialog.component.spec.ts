import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkreaddialogComponent } from './markreaddialog.component';

describe('MarkreaddialogComponent', () => {
  let component: MarkreaddialogComponent;
  let fixture: ComponentFixture<MarkreaddialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkreaddialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkreaddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
