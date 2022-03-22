import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostScrollComponent } from './user-post-scroll.component';

describe('UserPostScrollComponent', () => {
  let component: UserPostScrollComponent;
  let fixture: ComponentFixture<UserPostScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPostScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPostScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
