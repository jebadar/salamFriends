import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTextComponent } from './post-text.component';

describe('PostTextComponent', () => {
  let component: PostTextComponent;
  let fixture: ComponentFixture<PostTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
