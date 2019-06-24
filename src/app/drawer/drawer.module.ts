import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DrawerComponent } from "./drawer/drawer.component";
import { PortalModule } from "@angular/cdk/portal";

@NgModule({
  declarations: [DrawerComponent],
  imports: [CommonModule, PortalModule],
  entryComponents: [DrawerComponent]
})
export class DrawerModule {}
