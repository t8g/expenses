import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PaginationComponent } from "./pagination.component";
import { By } from "@angular/platform-browser";
import { Component } from "@angular/core";

@Component({
  template: `
    <t8g-pagination
      [pageCount]="5"
      [currentPage]="page"
      (pageChange)="pageChange($event)"
    ></t8g-pagination>
  `
})
export class TestWrapperComponent {
  page: number = 2;
  pageChange(page) {
    this.page = page;
  }
}

describe("PaginationComponent", () => {
  let wrapper: TestWrapperComponent;
  let component: PaginationComponent;
  let fixture: ComponentFixture<TestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaginationComponent, TestWrapperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(PaginationComponent))
      .componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the pages", () => {
    const links = fixture.debugElement.queryAll(By.css("li"));
    expect(links.length).toEqual(7); // 5 pages & prev & next
  });

  it("should display current page highlighted", () => {
    const link = fixture.debugElement.queryAll(By.css("li"))[2];
    expect(link.classes["active"]).toBeTruthy();
  });

  it("should display other page not highlighted", () => {
    const link = fixture.debugElement.queryAll(By.css("li"))[3];
    expect(link.classes["active"]).toBeFalsy();
  });

  it("should change to previous page on prev click", () => {
    const link = fixture.debugElement.queryAll(By.css("li a"))[0];
    const linkElement = link.nativeElement;
    expect(linkElement.textContent).toEqual("Prev");
    link.triggerEventHandler("click", null);
    expect(wrapper.page).toEqual(1);
  });

  it("should change to next page on next click", () => {
    const links = fixture.debugElement.queryAll(By.css("li a"));
    const link = links[links.length - 1];

    const linkElement = link.nativeElement;
    expect(linkElement.textContent).toEqual("Next");
    link.triggerEventHandler("click", null);
    expect(wrapper.page).toEqual(3);
  });
});
