import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class InboxComponent implements OnInit {

  constructor() { }
  asset_url = Constants.ASSET_URL;
  ngOnInit() {
  }

}
