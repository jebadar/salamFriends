import { Component, OnInit, Input } from '@angular/core';
import { PostWrapperComponent  } from '../../users/post-wrapper/post-wrapper.component'
import { TimelineComponent } from '../../posts/timeline/timeline.component';
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { Router,ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private pageService:PageService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) { }
  post_id: number = 0;
  asset_url = Constants.ASSET_URL;
  pageId:string;
  pageData:any = {};
  likes:string;
  title:string;
  postID(event) {
    this.post_id = event;
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.pageId = params.id;
        this.fetchPageData(this.pageId)
      }
    });
  }
  fetchPageData(id)
  {
    this.pageService.getPagebyId(id)
    .subscribe(data => {
      this.pageData = data.json();
      // this.likes = this.pageData.likes.length
      let temp = this.pageData.likes.filter(x => x.status == '1')
      this.likes =  temp.length
      this.title = this.pageData.category.title;
    })
  }

}
