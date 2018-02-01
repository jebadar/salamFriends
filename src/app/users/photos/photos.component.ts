import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../constants'
import { UserServicesService } from '../user-services.service';
import { Router } from '@angular/router';
import { DpComponent } from '../../shared/dp/dp.component'
import { Lightbox } from 'angular2-lightbox';
import { LoaderComponent } from '../../shared/loader/loader.component'

@Component({
  selector: 'photos-component',
  templateUrl: './photos.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PhotosComponent implements OnInit {
  asset_url = Constants.ASSET_URL;
  @Input() user_Id;
  @Input() tabPhotos;
  @Input() searchCheck;
  loading = false;
  tabCheck = false;
  thumPhoto = true;
  postPhoto = true;
  loadBtnCheck = false;
  store_url = Constants.STORAGE_URL;
  posts: Array<any> = [];
  limit = 7;
  offset = 0
  _lightbox: Lightbox;
  _albums = [];
  constructor(
    private router: Router,
    private userService:UserServicesService,
    _lightbox: Lightbox
  ) {
    this._lightbox = _lightbox;
   }

  ngOnInit() {
    this.setFlag(); 
    this.fetchPost(this.user_Id,this.limit,this.offset);
  }

  fetchPost(id,limit,offset)
  {
    this.loading = true;
    this.userService.getUserPhotos(id,limit,offset)
    .subscribe(data => {
      if(this.posts.length < 1){
        this.posts = data;
        this._albums = data.album;
        if(this.posts.length >= limit)
        {
          this.loadBtnCheck = true;
        }
      }
      else
      {
        for(let count = 0;count < data.album.length;count++)
        {
          this._albums.push(data.album[count]);
        }
        this.pushPost(data);
      }
      this.loading = false;
    })
  }
  setFlag()
  {
    if(this.tabPhotos)
    {
      this.tabCheck = this.tabPhotos
      this.limit = 18;
    }
  }
  viewAllPhotos()
  {
    if(this.searchCheck)
    {
      this.router.navigate(['user/'+this.user_Id+'/photos']);
    }
    else{
      this.router.navigate(['profile/photos']);
    }
  }
  loadMore()
  {
    this.offset = this.offset + this.limit;
    this.fetchPost(this.user_Id,this.limit,this.offset);
  }
  openImage(index: number): void {
    // open lightbox 
    this._lightbox.open(this._albums, index);
  }
  
 pushPost(postArr)
 {
  postArr.forEach(item => {
    this.posts.push(item);
  });
 }
}
