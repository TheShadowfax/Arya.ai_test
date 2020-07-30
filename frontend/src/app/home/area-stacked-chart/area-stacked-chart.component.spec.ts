import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaStackedChartComponent } from './area-stacked-chart.component';

describe('AreaStackedChartComponent', () => {
  let component: AreaStackedChartComponent;
  let fixture: ComponentFixture<AreaStackedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaStackedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
