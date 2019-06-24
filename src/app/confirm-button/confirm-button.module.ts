import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ConfirmButtonComponent } from "./confirm-button/confirm-button.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [ConfirmButtonComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [ConfirmButtonComponent]
})
export class ConfirmButtonModule {}
