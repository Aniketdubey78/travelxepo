import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailsFormComponent } from './post-details-form.component';

describe('PostDetailsFormComponent', () => {
  let component: PostDetailsFormComponent;
  let fixture: ComponentFixture<PostDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
