import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatsService } from './../shared/stats.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private readonly statsService: StatsService
  ) { }

  dateForm = new FormGroup({
    from: new FormControl(this.formatTimeStampToDateString(Date.now() - ((1000 * 60 * 60 * 24)) * 6), [Validators.required]),
    to: new FormControl(this.formatTimeStampToDateString(Date.now()), [Validators.required])
  })

  ngOnDestroy(): void {
    this.statsService.unsubscribe()
  }

  ngOnInit(): void {
    console.log(this.dateForm.controls.from.value);
    this.dateForm.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
      console.log(val);
      const { from, to } = val;
      if (this.compareDateString(from, to)) {
        this.dateForm.setErrors([Validators.required]);
      } else {
        const fromTimeStamp = new Date(from).getTime() / 1000;
        const toTimeStamp = new Date(to).getTime() / 1000;
        this.statsService.changeDate(fromTimeStamp, toTimeStamp);
      }

    })

  }

  formatTimeStampToDateString(timeStamp: number) {
    const date = new Date(timeStamp);
    const dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' });
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat.formatToParts(date);
    return `${year}-${month}-${day}`;
  }

  compareDateString(date1: string, date2: string) {
    return new Date(date1).getTime() > new Date(date2).getTime()

  }

}
