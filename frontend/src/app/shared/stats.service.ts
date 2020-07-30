import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State } from './state';
import { environment } from '../../environments/environment';
import { combineLatest, Subject, Observable, of, from } from 'rxjs';
import { map, distinctUntilChanged, switchMap, takeUntil, catchError } from 'rxjs/operators';


export interface IStats {
  accepted: number;
  rejected: number;
  error: number;
  total: number;
  formattedDate: string;
}

export interface IStatsState {
  data: IStats[];
  from: number;
  to: number;
  loading: boolean;
  error: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class StatsService extends State<IStatsState>{

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly http: HttpClient
  ) {

    super({
      data: [],
      to: Math.round(Date.now() / 1000),
      from: Math.round((Date.now() / 1000) - ((60 * 60 * 24)) * 6),
      error: false,
      loading: false
    }, false);

    combineLatest(
      this.state$.pipe(map(state => state.from), distinctUntilChanged()),
      this.state$.pipe(map(state => state.to), distinctUntilChanged()),
    ).pipe(
      switchMap(([from, to]) => this.fetchStats()),
      takeUntil(this.destroy$)
    ).subscribe((val: IStats[]) => {
      this.setState({ data: val, loading: false })
    })
  }


  changeDate(from: number, to: number) {
    this.setState({ from, to })
  }

  private fetchStats(): Observable<IStats[]> {
    const endpoint = this.buildSearchUrl();
    this.setState({ loading: true })
    return this.http.get<IStats[]>(endpoint).pipe(
      catchError((err) => {
        console.error(err);
        this.setState({ loading: false, error: true });
        return from([])
      })
    )
  }

  private buildSearchUrl() {
    const { from, to } = this.store.getValue();
    console.log(from, to);

    return `${environment.backendUrl}store?from=${from}&to=${to}`;
  }

  unsubscribe() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
