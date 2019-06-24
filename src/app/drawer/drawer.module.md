_Usage:_

Import DrawerModule in your module

```javascript
import { DrawerModule } from "../drawer/drawer.module";

@NgModule {
  imports: [ DrawerModule ],
  entryComponents: [ CardComponent ] // local component displayed in the drawer
}
```

Use DrawerService & DrawerRef to open drawer with your component inside (here CardComponent)

```javascript
const drawerRef: DrawerRef<CardComponent> = this.drawer.open(
  CardComponent,
  expense
);
drawerRef.onModalClose().subscribe((response: string) => {
  // the response type depends on CardComponent return
});
```

Do not forget to add CardComponent to entryComponents

Inside CardComponent you can use DrawerService.close(response) to close the drawer

```javascript
this.drawerService.close("OK");
```
