import { Component, OnInit,Input } from '@angular/core';
import { Constants } from '../../constants';

@Component({
  selector: 'dp-component',
  templateUrl: './dp.component.html',
  styleUrls: ['./dp.component.css']
})
export class DpComponent implements OnInit {
 @Input() profilePic;
 @Input() dimension;
 @Input() postPhoto:boolean;
 @Input() thumPhoto:boolean;
 @Input() albumPhoto:boolean
 image:string = "";
 widthNheigth:number = 100;
 Store_URL = Constants.STORAGE_URL;
 Assets_URL = Constants.ASSET_URL;
 class="image";
  constructor() { }
  ngOnInit() {
    this.initImageUrl(this.profilePic);
  }
  initImageUrl(urlArray)
  {
    if (urlArray.length > 0 && urlArray[0].picture != undefined) {
      this.image = this.Store_URL + urlArray[0].picture.path;
    }
    else {
      if(this.postPhoto && urlArray != undefined)
      {
        this.image = this.Store_URL + urlArray;
        this.class = "photo-profile";
      }
      else if(this.thumPhoto && urlArray != undefined)
      {
        this.image =this.Store_URL + urlArray;
        this.class = "photo-thum"
      }
      else if(this.albumPhoto && urlArray != undefined)
      {
        this.image =this.Store_URL + urlArray;
        this.class = "album-image"
      }
      else
      {
        this.image = this.Assets_URL + "images/member-1.jpg";
      }
    }
    if(this.dimension != undefined)
    {
      this.widthNheigth = this.dimension;
    }
  }

  errorHandler(event) {
    this.image = this.Assets_URL + "images/not-found-image.png";
    //this.image = "../../assets/images/not-found-image.png"
  }
}
