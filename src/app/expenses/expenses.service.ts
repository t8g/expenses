import { Injectable } from "@angular/core";
import { ExpensesProviderService } from "./expenses.provider.service";
import { Observable, BehaviorSubject } from "rxjs";
import { Expense } from "./expense";
import { map, tap } from "rxjs/operators";

const itemsPerPage = 5;

interface Store {
  count: number;
  entities: { [id: string]: Expense };
  page: number;
  sort: string;
  direction: string;
}

const initialStore: Store = {
  count: 10,
  entities: {},
  page: 0,
  sort: "createdAt",
  direction: "asc"
};

@Injectable({
  providedIn: "root"
})
export class ExpensesService {
  private store$: BehaviorSubject<Store> = new BehaviorSubject(initialStore);

  expenses$: Observable<Expense[]> = this.store$
    .asObservable()
    .pipe(
      map(({ entities }) => Object.keys(entities).map(key => entities[key]))
    );

  pageCount$: Observable<number> = this.store$
    .asObservable()
    .pipe(map(({ count }) => Math.ceil(count / itemsPerPage)));

  page$: Observable<number> = this.store$
    .asObservable()
    .pipe(map(({ page }) => page));

  sort$: Observable<{
    sort: string;
    direction: string;
  }> = this.store$
    .asObservable()
    .pipe(map(({ sort, direction }) => ({ sort, direction })));

  constructor(private expensesProvider: ExpensesProviderService) {}

  sort(sort: string) {
    let { page, sort: old, direction } = this.store$.value;
    if (sort === old) direction = direction === "asc" ? "desc" : "asc";
    else page = 1;
    this.fetchExpense({ page, sort, direction });
  }

  fetchExpense({
    page,
    sort,
    direction
  }: {
    page?: number;
    sort?: string;
    direction?: string;
  }) {
    const stored = this.store$.value;
    sort = sort || stored.sort;
    direction = direction || stored.direction;
    page = page || stored.page;
    this.expensesProvider
      .getExpenses(page, itemsPerPage, sort, direction)
      .subscribe(({ items, count }) => {
        this.store$.next({
          ...stored,
          page,
          sort,
          direction,
          count,
          entities: items.reduce(
            (acc, expense) => ({ ...acc, [expense.id]: expense }),
            {}
          )
        });
      });
  }

  removeExpense(expense: Expense) {
    this.expensesProvider
      .removeExpense(expense.id)
      .subscribe(() => this.fetchExpense({}));
  }

  // note used as we edit from list with all informations
  // getExpense(id: string): Observable<Expense> {
  //   // @TODO search in store or get from api if not found
  //   return this.getExpense({ page: id });
  // }

  saveExpense(expense: Expense): Observable<Expense> {
    const isNewExpense = !expense.createdAt;
    const stored = this.store$.value;
    return this.expensesProvider.saveExpense(expense).pipe(
      tap(savedExpense => {
        if (isNewExpense) {
          const page = Math.ceil((stored.count + 1) / itemsPerPage);
          this.fetchExpense({ page });
        } else {
          this.store$.next({
            ...stored,
            entities: { ...stored.entities, [savedExpense.id]: savedExpense }
          });
        }
      })
    );
  }
}
