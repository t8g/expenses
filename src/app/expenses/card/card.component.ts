import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from "@angular/core";
import { DrawerService, DRAWER_DATA } from "../../drawer/drawer.service";
import { Expense } from "../expense";
import { ExpensesService } from "../expenses.service";
import { Subscription, Observable } from "rxjs";
import { CurrencyService } from "../currency.service";

@Component({
  selector: "t8g-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnDestroy {
  private expenseSub: Subscription;
  public currencies$: Observable<string[]>;

  constructor(
    private expenseService: ExpensesService,
    private currencyService: CurrencyService,
    private drawer: DrawerService,
    @Inject(DRAWER_DATA) public expense: Expense
  ) {
    this.currencies$ = this.currencyService.getCurrencies();
  }

  save(expense: Expense) {
    this.expenseSub = this.expenseService
      .saveExpense(expense)
      .subscribe((exp: Expense) => {
        this.drawer.close(expense);
      });
  }

  cancel() {
    this.drawer.close(null);
  }

  ngOnDestroy() {
    this.expenseSub && this.expenseSub.unsubscribe();
  }
}
