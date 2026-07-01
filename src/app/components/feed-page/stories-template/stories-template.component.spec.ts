import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoriesTemplateComponent } from './stories-template.component';

describe('StoriesTemplateComponent', () => {
  let component: StoriesTemplateComponent;
  let fixture: ComponentFixture<StoriesTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoriesTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoriesTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
