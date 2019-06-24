import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ExpensesService } from "../expenses.service";
import { Observable } from "rxjs";
import { Expense } from "../expense";
import { DrawerService, DrawerRef } from "../../drawer/drawer.service";
import { CardComponent } from "../card/card.component";
import uuid from "uuid/v4";
import { tap, map } from "rxjs/operators";

@Component({
  selector: "t8g-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  public expenses$: Observable<Expense[]> = this.expensesService.expenses$;
  public updatedItemId: string;
  public pageCount$: Observable<number> = this.expensesService.pageCount$;
  public page$: Observable<number> = this.expensesService.page$;

  constructor(
    private expensesService: ExpensesService,
    private drawer: DrawerService
  ) {}

  ngOnInit() {
    this.expensesService.fetchExpense({ page: 1 });
  }

  editExpense(expense: Expense) {
    const drawerRef: DrawerRef<CardComponent> = this.drawer.open(
      CardComponent,
      expense
    );
    drawerRef.onModalClose().subscribe((expense: Expense | null) => {
      this.updatedItemId = expense && expense.id;
    });
  }

  addExpense() {
    this.editExpense({
      id: uuid(),
      purchasedOn: new Date(),
      comment: "",
      originalAmount: {
        amount: 0,
        currency: "EUR"
      },
      convertedAmount: {
        amount: 0,
        currency: "EUR"
      },
      nature: ""
    });
  }

  removeExpense(expense: Expense) {
    this.expensesService.removeExpense(expense);
  }

  sort(by) {
    this.expensesService.sort(by);
  }

  sortClass(by): Observable<string> {
    return this.expensesService.sort$.pipe(
      map(({ sort, direction }) => (sort !== by ? "" : direction))
    );
  }

  pageChange(page: number) {
    this.expensesService.fetchExpense({ page });
  }
}
