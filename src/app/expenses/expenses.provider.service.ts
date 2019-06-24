import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Expense } from "./expense";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

const { url, token } = environment.expenseApi;

const headers: HttpHeaders = new HttpHeaders({
  Authorization: `Bearer ${token}`
});

@Injectable({
  providedIn: "root"
})
export class ExpensesProviderService {
  constructor(private http: HttpClient) {}

  getExpenses(
    page: number,
    limit: number,
    sort?: string,
    direction?: string
  ): Observable<{ items: any[]; count: number }> {
    const offset = (page - 1) * limit;
    const u = this.buildUrl({
      offset,
      limit,
      orderby: [sort, direction].filter(x => !!x).join(",")
    });

    return this.http
      .get<{ items: Expense[]; count: number }>(u, {
        headers
      })
      .pipe(
        map(({ items, count }) => {
          return { items: this.convertAllToExpense(items), count };
        }),
        catchError(this.error)
      );
  }

  getExpense(id: string): Observable<Expense> {
    return this.http
      .get<Expense>(`${url}/${id}`, { headers })
      .pipe(map(exp => this.convertToExpense(exp)));
  }

  saveExpense(expense: Expense): Observable<Expense> {
    const saveExpense$ = expense.createdAt
      ? this.putExpense(this.convertFromExpense(expense))
      : this.postExpense(this.convertFromExpense(expense));

    return saveExpense$.pipe(
      map(exp => this.convertToExpense(exp)),
      catchError(this.error)
    );
  }

  removeExpense(id: string): Observable<any> {
    return this.http.delete(`${url}/${id}`, { headers });
  }

  private buildUrl(queryParams: { [key: string]: string | number }) {
    const query = Object.keys(queryParams)
      .reduce(
        (acc, key) =>
          queryParams[key] !== ""
            ? [...acc, `${key}=${queryParams[key]}`]
            : acc,
        []
      )
      .join("&");
    return query ? `${url}?${query}` : url;
  }

  private postExpense(expense): Observable<any> {
    return this.http.post(`${url}`, expense, { headers });
  }

  private putExpense(expense: { id: string }): Observable<any> {
    return this.http.put(`${url}/${expense.id}`, expense, {
      headers
    });
  }

  private error(error) {
    console.error("ERROR");
    return throwError(error);
  }

  private convertAllToExpense(expenses: any[]): Expense[] {
    return expenses.map(expense => this.convertToExpense(expense));
  }

  private convertToExpense(expense: any): Expense {
    return {
      ...expense,
      purchasedOn: this.parseISOString(expense.purchasedOn)
    };
  }

  private convertFromExpense(expense: Expense) {
    return {
      ...expense,
      purchasedOn: expense.purchasedOn.toISOString().substr(0, 10)
    };
  }

  private parseISOString(s: string): Date {
    const b = s.split(/\D+/).map(n => Number(n));
    return b.length > 3
      ? new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))
      : new Date(Date.UTC(b[0], --b[1], b[2]));
  }
}
