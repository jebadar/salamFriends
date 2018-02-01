import { Component, OnInit, Input } from '@angular/core';
import {Constants } from  '../../constants'

@Component({
  selector: 'settings-component',
  inputs: ['infoArray'],
  templateUrl: './settings.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() {

  }

  @Input() infoArray: info;
  @Input() set detailArray(value: Array<string>) {
    this.detailArray1 = value;
    if (this.detailArray1 != undefined) {
      this.detailCheck = true;
    }
  }
  title: Array<string> = [];
  detailCheck = false;
  detailArray1;
  asset_url = Constants.ASSET_URL;
  ngOnInit() {
   if(this.infoArray.subinfo != undefined ) {
    this.initInfoArray()
   }
  }
  initInfoArray() {
    for (let counter = 0; counter < this.infoArray.subinfo.length; counter++) {
      this.title.push(this.infoArray.subinfo[counter].title);
    }
  }
}

interface info {
  id: number,
  status: string,
  title: string,
  update_at: string,
  subinfo: Array<subinfo>
}
interface subinfo {
  created_at: string,
  id: string,
  info_id: string,
  title: string,
  updated_at: string
}