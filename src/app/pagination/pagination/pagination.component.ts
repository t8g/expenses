import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";

@Component({
  selector: "t8g-pagination",
  templateUrl: "./pagination.component.html",
  styleUrls: ["./pagination.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent implements OnChanges {
  @Input() pageCount: number = 0;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  pages: number[] = [];

  constructor() {}

  ngOnChanges() {
    this.pages = Array(this.pageCount)
      .fill(0)
      .map((_, i) => i + 1);
  }

  setPage(page) {
    if (page <= 0 || page > this.pageCount) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }
}
