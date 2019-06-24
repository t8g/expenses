import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Amount } from "../expense";

@Component({
  selector: "t8g-amount",
  templateUrl: "./amount.component.html",
  styleUrls: ["./amount.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountComponent implements OnInit {
  @Input() amounts: Amount[];

  constructor() {}

  ngOnInit() {
    // remove duplicate currencies amounts
    this.amounts = this.amounts.reduce(
      (acc, amount) =>
        !!acc.find((a: Amount) => a.currency === amount.currency)
          ? acc
          : [...acc, amount],
      []
    );
  }
}
