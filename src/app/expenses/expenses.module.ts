import { NgModule, LOCALE_ID } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import localeFr from "@angular/common/locales/fr";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";

import { ListComponent } from "./list/list.component";
import { CardComponent } from "./card/card.component";
import { FormComponent } from "./form/form.component";
import { DrawerModule } from "../drawer/drawer.module";
import { PaginationModule } from "../pagination/pagination.module";
import { LoaderComponent } from "./loader/loader.component";
import { ConfirmButtonModule } from "../confirm-button/confirm-button.module";
import { AmountComponent } from "./amount/amount.component";

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    ListComponent,
    CardComponent,
    FormComponent,
    LoaderComponent,
    AmountComponent
  ],
  imports: [
    CommonModule,
    DrawerModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    PaginationModule,
    ConfirmButtonModule
  ],
  exports: [ListComponent],
  entryComponents: [CardComponent],
  providers: [MatNativeDateModule, { provide: LOCALE_ID, useValue: "fr" }]
})
export class ExpensesModule {}
