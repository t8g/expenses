import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from "../../environments/environment";
import { map, refCount, publishReplay } from "rxjs/operators";

const { url: currencyUrl } = environment.currencyApi;

type Rates = { base: string; date: string; rates: { [code: string]: number } };

@Injectable({
  providedIn: "root"
})
export class CurrencyService {
  // cache
  private currencies$: Observable<string[]>;

  constructor(private http: HttpClient) {}

  getCurrencies(): Observable<string[]> {
    if (!this.currencies$) {
      this.currencies$ = this.http.get<Rates>(currencyUrl).pipe(
        map(({ rates }) => ["EUR", ...Object.keys(rates)]),
        publishReplay(1),
        refCount()
      );
    }
    return this.currencies$;
  }

  convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Observable<number> {
    if (fromCurrency === toCurrency) return of(amount);
    return this.http
      .get<Rates>(`${currencyUrl}?base=${fromCurrency}&symbols=${toCurrency}`)
      .pipe(map(({ rates }) => this.fixDecimal(rates[toCurrency] * amount)));
  }

  // api need number with 6 digits
  fixDecimal(n: number): number {
    return Number(n.toFixed(5));
  }
}
