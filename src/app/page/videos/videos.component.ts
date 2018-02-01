import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { LoaderComponent } from '../../shared/loader/loader.component'
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class VideosComponent implements OnInit {

  constructor(
    private pageService:PageService,
    private activatedRoute: ActivatedRoute
  ) { }
  asset_url = Constants.ASSET_URL;
  store_url = Constants.STORAGE_URL;
  user;
  limit = 7;
  offset = 0;
  posts: Array<any> = [];
  _albums = [];
  loadBtnCheck;
  loading= false;
  pageId;
  ngOnInit() {
    let url;
    this.activatedRoute.parent.params.forEach((params:Params) => {
      url = params['url'];
      this.pageId = +params['id'];
      });
    this.fetchVideos(this.pageId,this.limit,this.offset)
  }
  fetchVideos(id,limit,offset)
  {
    this.loading = true;
    this.pageService.getPageVideos(id,limit,offset)
    .subscribe(data => {
      this.posts = data
      this.loading = false;
    })
  }

}
