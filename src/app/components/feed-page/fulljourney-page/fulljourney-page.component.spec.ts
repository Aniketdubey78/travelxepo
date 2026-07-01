import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FulljourneyPageComponent } from './fulljourney-page.component';

describe('FulljourneyPageComponent', () => {
  let component: FulljourneyPageComponent;
  let fixture: ComponentFixture<FulljourneyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FulljourneyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FulljourneyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
