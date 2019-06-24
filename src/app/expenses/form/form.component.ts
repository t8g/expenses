import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { Expense } from "../expense";
import { map, switchMap, startWith, tap } from "rxjs/operators";
import { CurrencyService } from "../currency.service";
import { Observable } from "rxjs";

import { ErrorStateMatcher } from "@angular/material/core";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

/**
 * Expense form component
 *
 * - Validation
 */
@Component({
  selector: "t8g-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  @Input() expense: Expense;
  @Input() currencies: string[];
  @Output() onSave: EventEmitter<Expense> = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  public form: FormGroup;
  public amountForm: FormGroup;
  public convertedForm: FormGroup;
  public displayConverted$: Observable<boolean>;
  public loading = false;

  matcher = new MyErrorStateMatcher();

  constructor(private currencyService: CurrencyService) {
    this.amountForm = new FormGroup({
      amount: new FormControl(),
      currency: new FormControl()
    });
    this.form = new FormGroup({
      purchasedOn: new FormControl(),
      nature: new FormControl("", [
        Validators.required,
        Validators.maxLength(120)
      ]),
      comment: new FormControl(),
      originalAmount: this.amountForm,
      convertedAmount: new FormGroup({
        amount: new FormControl(),
        currency: new FormControl()
      })
    });

    this.amountForm.valueChanges
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(({ amount, currency }) =>
          this.currencyService.convert(
            amount,
            currency,
            this.expense.convertedAmount.currency
          )
        ),
        tap(() => (this.loading = false))
      )
      .subscribe((amount: number) => {
        this.form.controls["convertedAmount"].patchValue({ amount });
      });
  }

  ngOnInit() {
    this.form.patchValue(this.expense);
    this.displayConverted$ = this.amountForm.controls[
      "currency"
    ].valueChanges.pipe(
      map(
        (currency: string) => currency !== this.expense.convertedAmount.currency
      ),
      startWith(
        this.expense.originalAmount.currency !==
          this.expense.convertedAmount.currency
      )
    );
  }

  save() {
    if (this.form.valid) {
      // only keep 6 decimals
      this.expense.originalAmount.amount = this.currencyService.fixDecimal(
        this.expense.originalAmount.amount
      );
      this.onSave.emit({
        ...this.expense,
        ...this.form.value
      });
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
