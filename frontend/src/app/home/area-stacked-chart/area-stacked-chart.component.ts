import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { StatsService, IStats } from '../../shared/stats.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-area-stacked-chart',
  templateUrl: './area-stacked-chart.component.html',
  styleUrls: ['./area-stacked-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaStackedChartComponent implements OnInit {

  constructor(
    readonly statsService: StatsService
  ) { }

  private data: IStats[];
  stats = {
    total: 0,
    accepted: 0,
    rejected: 0,
    error: 0,
  }

  ngOnInit(): void {
    this.statsService.state$.pipe(distinctUntilChanged()).subscribe((val) => {
      console.log('val changed', val);
      this.data = val.data;
      this.prepareData();
    })
  }

  prepareData() {
    let accepted = [], rejected = [], error = [], total = [];
    this.lineChartLabels = [];
    for (const iterator of this.data) {
      accepted.push(iterator.accepted);
      rejected.push(iterator.rejected);
      error.push(iterator.error);
      total.push(iterator.total);
      this.lineChartLabels.push(iterator.formattedDate)
    }

    this.lineChartData = [
      { data: total, label: 'Total' },
      { data: accepted, label: 'Accepted' },
      { data: rejected, label: 'Rejected' },
      { data: error, label: 'Error' },
    ];

    this.stats.total = total.reduce((p, c) => p + c, 0);
    this.stats.accepted = accepted.reduce((p, c) => p + c, 0);
    this.stats.rejected = rejected.reduce((p, c) => p + c, 0);
    this.stats.error = error.reduce((p, c) => p + c, 0);

  }

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total' },
    { data: [], label: 'Accepted' },
    { data: [], label: 'Rejected' },
    { data: [], label: 'Error' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: '#007EFF',
      // backgroundColor: 'rgba(47,128,237,0.28)',
      backgroundColor: 'rgba(232,152,6,0.1)',
    },
    {
      borderColor: '#1AB759',
      // backgroundColor: 'rgba(23,186,29,0.28)',
      backgroundColor: 'rgba(232,152,6,0.1)',
    },
    {
      borderColor: '#E89806',
      backgroundColor: 'rgba(232,152,6,0.1)',
    },
    {
      borderColor: '#E93C3C',
      // backgroundColor: 'rgba(233,60,60,0.28)',
      backgroundColor: 'rgba(232,152,6,0.1)',
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
}
