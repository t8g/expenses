import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "t8g-confirm-button",
  templateUrl: "./confirm-button.component.html",
  styleUrls: ["./confirm-button.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmButtonComponent {
  @Output() onCancel = new EventEmitter();
  @Output() onConfirm = new EventEmitter();

  open: boolean = false;

  slide() {
    this.open = true;
  }

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
    this.open = false;
  }
}
