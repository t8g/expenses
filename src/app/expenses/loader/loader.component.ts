import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 't8g-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
