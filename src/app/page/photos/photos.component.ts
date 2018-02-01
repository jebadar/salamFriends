import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { LoaderComponent } from '../../shared/loader/loader.component'
import { ActivatedRoute, Params } from '@angular/router';
import { DpComponent } from '../../shared/dp/dp.component'
import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PhotosComponent implements OnInit {

  constructor(
    private pageService:PageService,
    private activatedRoute: ActivatedRoute,
    _lightbox: Lightbox
  ) { 
    this._lightbox = _lightbox;
  }
  _lightbox: Lightbox;
  asset_url = Constants.ASSET_URL;
  user;
  limit = 7;
  offset = 0;
  posts: Array<any> = [];
  _albums = [];
  loadBtnCheck;
  loading;
  pageId;
  albumPhoto = true;
  width = 230
  ngOnInit() {
    let url;
    this.activatedRoute.parent.params.forEach((params:Params) => {
      url = params['url'];
      this.pageId = +params['id'];
      });
    this.fetchPhotos(this.pageId,this.limit,this.offset)
  }
  fetchPhotos(id,limit,offset)
  {
    this.loading = true;
    this.pageService.getPagePhotos(id,limit,offset)
    .subscribe(data => {
      if(this.posts.length < 1){
        this.posts = data;
        this._albums = data.album;
        if(this.posts.length >= this.limit)
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
  pushPost(postArr)
  {
   postArr.forEach(item => {
     this.posts.push(item);
   });
  }
  openImage(index: number): void {
    // open lightbox 
    this._lightbox.open(this._albums, index);
  }

}
