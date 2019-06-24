import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

/**
 * Simple html/css loader (no logic)
 */
@Component({
  selector: "t8g-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
