import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawerComponent } from "./drawer/drawer.component";
import { PortalModule } from "@angular/cdk/portal";

/**
 * **Display a right sided drawer with a given component.**
 */
@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, PortalModule],
  entryComponents: [DrawerComponent]
})
export class DrawerModule {}
