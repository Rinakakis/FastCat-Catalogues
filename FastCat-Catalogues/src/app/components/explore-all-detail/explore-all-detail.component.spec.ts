import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreAllDetailComponent } from './explore-all-detail.component';

describe('ExploreAllDetailComponent', () => {
  let component: ExploreAllDetailComponent;
  let fixture: ComponentFixture<ExploreAllDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreAllDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreAllDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
