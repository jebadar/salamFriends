import { Component, OnInit } from '@angular/core';
import { TimelineComponent } from '../../posts/timeline/timeline.component';
import { Constants } from '../../constants';
import { Router,ActivatedRoute, Params } from '@angular/router';
import { PageService } from '../page.service'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PostsComponent implements OnInit {

  constructor(
    private pageService:PageService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ) {
    
   }
  post_id: number = 0;
  asset_url = Constants.ASSET_URL;
  pageId;
  postTabCheck = true;
  ngOnInit() {
    let url;
    this.activatedRoute.parent.params.forEach((params:Params) => {
      url = params['url'];
      this.pageId = +params['id'];
      });
  }

}
