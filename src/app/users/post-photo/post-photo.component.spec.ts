import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPhotoComponent } from './post-photo.component';

describe('PostPhotoComponent', () => {
  let component: PostPhotoComponent;
  let fixture: ComponentFixture<PostPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
