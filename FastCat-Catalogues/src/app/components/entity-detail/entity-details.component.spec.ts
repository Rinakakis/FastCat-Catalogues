import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDetailComponent } from './entity-details.component';

describe('EntityDetailComponent', () => {
  let component: EntityDetailComponent;
  let fixture: ComponentFixture<EntityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntityDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
