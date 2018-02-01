import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar-component',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
@Input() width;
@Input() height;
  constructor() { }

  ngOnInit() {
  }

}
