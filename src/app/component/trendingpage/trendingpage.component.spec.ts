import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingpageComponent } from './trendingpage.component';

describe('TrendingpageComponent', () => {
  let component: TrendingpageComponent;
  let fixture: ComponentFixture<TrendingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrendingpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
