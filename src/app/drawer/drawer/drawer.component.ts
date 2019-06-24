import {
  Component,
  ViewChild,
  EmbeddedViewRef,
  ComponentRef,
  Input
} from "@angular/core";
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  TemplatePortal,
  ComponentPortal
} from "@angular/cdk/portal";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "t8g-drawer",
  templateUrl: "./drawer.component.html",
  styleUrls: ["./drawer.component.css"]
})
export class DrawerComponent extends BasePortalOutlet {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  @Input()
  open = false;

  private modalClose: Subject<any> = new Subject();

  onModalClose(): Observable<any> {
    return this.modalClose.asObservable();
  }

  close(data: any = null) {
    this.open = false;
    this.modalClose.next(data);
    this.modalClose.complete();
    this._portalOutlet.detach();
  }

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    if (this._portalOutlet.hasAttached()) {
      throw new Error("already");
    }

    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    if (this._portalOutlet.hasAttached()) {
      throw new Error("already");
    }
    return this._portalOutlet.attachTemplatePortal(portal);
  }
}
