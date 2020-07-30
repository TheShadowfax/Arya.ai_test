import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ChartsModule } from 'ng2-charts';
import { AreaStackedChartComponent } from './area-stacked-chart/area-stacked-chart.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HomeComponent, AreaStackedChartComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ChartsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
