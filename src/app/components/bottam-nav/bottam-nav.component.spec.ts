import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottamNavComponent } from './bottam-nav.component';

describe('BottamNavComponent', () => {
  let component: BottamNavComponent;
  let fixture: ComponentFixture<BottamNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BottamNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottamNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
