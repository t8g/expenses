import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ComponentRef,
  InjectionToken
} from "@angular/core";
import {
  ComponentPortal,
  ComponentType,
  PortalInjector,
  DomPortalHost
} from "@angular/cdk/portal";
import { DrawerComponent } from "./drawer/drawer.component";
import { Observable, Subject } from "rxjs";

export const DRAWER_DATA = new InjectionToken<{}>("PortalData");

export class DrawerRef<T> {
  private modalClose: Subject<any> = new Subject();

  constructor(public containerRef: ComponentRef<DrawerComponent>) {}

  onModalClose(): Observable<any> {
    return this.modalClose.asObservable();
  }

  close(data: any) {
    this.modalClose.next(data);
    this.modalClose.complete();
  }
}

@Injectable({
  providedIn: "root"
})
export class DrawerService {
  containerRef: ComponentRef<DrawerComponent>;
  bodyPortalHost: DomPortalHost;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    this.bodyPortalHost = new DomPortalHost(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
  }

  open<T>(componentRef: ComponentType<T>, data: any): DrawerRef<T> {
    const drawerRef = new DrawerRef<T>(this.containerRef);
    const injector = this.createInjector<T>(drawerRef, data);

    this.containerRef = this.bodyPortalHost.attach<DrawerComponent>(
      new ComponentPortal(DrawerComponent)
    );

    this.containerRef.instance.attachComponentPortal(
      new ComponentPortal(componentRef, undefined, injector)
    );

    this.containerRef.instance.open = true;
    this.containerRef.instance.onModalClose().subscribe(data => {
      drawerRef.close(data);
      this.bodyPortalHost.detach();
    });
    return drawerRef;
  }

  close(data: any) {
    this.containerRef.instance.close(data);
  }

  private createInjector<T>(
    drawerRef: DrawerRef<T>,
    data: any
  ): PortalInjector {
    const injectorTokens = new WeakMap<any, any>([
      [DrawerRef, drawerRef],
      [DRAWER_DATA, data]
    ]);
    return new PortalInjector(this.injector, injectorTokens);
  }
}
