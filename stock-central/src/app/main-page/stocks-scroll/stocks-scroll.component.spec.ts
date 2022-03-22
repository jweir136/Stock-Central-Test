import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksScrollComponent } from './stocks-scroll.component';

describe('StocksScrollComponent', () => {
  let component: StocksScrollComponent;
  let fixture: ComponentFixture<StocksScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksScrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
