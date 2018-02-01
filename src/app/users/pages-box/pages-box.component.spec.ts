import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesBoxComponent } from './pages-box.component';

describe('PagesBoxComponent', () => {
  let component: PagesBoxComponent;
  let fixture: ComponentFixture<PagesBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
