import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { PostWrapperComponent } from '../../users/post-wrapper/post-wrapper.component'
import { FeedService } from '../feed.service'
import { UserServicesService } from '../../users/user-services.service';
import { SinglePostComponent } from '../../posts/single-post/single-post.component'
import { MenuComponent } from '../menu/menu.component';
import { LoaderComponent } from '../../shared/loader/loader.component'
import { StatusService } from '../../shared/status-service/status.service'
import { PostServicesService } from '../../posts/post-services.service';

@Component({
  selector: 'feed-main-component',
  templateUrl: './feed-main.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class FeedMainComponent implements OnInit {

  asset_url = Constants.ASSET_URL;
  Store_URL = Constants.STORAGE_URL;
  posts: Array<string> = [];
  user: any = {};
  userBasicInfo: any = {};
  imgProfile = "";
  point: number = 1;
  length: number = 0;
  result = [];
  checkToSend = false;
  detectmob: boolean;
  post_id: number = 0;
  loading = false;
  limit = 2;
  offset = 0;
  loadMoreCheck = false;
  constructor(
    private feedService: FeedService,
    private userServicesService: UserServicesService,
    private statusService: StatusService,
    private postServicesService:PostServicesService
  ) { }
  
  ngOnInit() {
    this.detectmob = this.userServicesService.detectmob();
    this.profileImage();
    this.fetchFeed();
    this.deleteVar = this.deleteVar.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    
    this.statusService.changeEmitted$.subscribe(this.updateStatus)
  }
  updateStatus(post) {
    post.user_id = post.belong_id;
    post.likes = [];
    post.comment = [];
    if(post.media === undefined) {
     post.media = [];
    }
    post.shares = [];
    post.tag = [];
    this.posts.splice(0, 0, post);
  }
  profileImage()
  {
    this.userServicesService.getUser(this.userServicesService.getLogedInUserId())
    .subscribe(data => {
      this.userBasicInfo = data;
      if (this.userBasicInfo.profile_pic.length > 0) {
        this.imgProfile = this.Store_URL + this.userBasicInfo.profile_pic[0].picture.path;
      }
      else {
        this.imgProfile = null;
      }
    });
  }
  fetchFeed()
  {
    this.loading = true;
    this.feedService.getTImeline(this.limit,this.offset)
    .subscribe(data => {
      if(this.posts.length < 1){
        this.posts = data.json();
      }
      else
      {
        let postsTemp = data.json();
        if(postsTemp.length < 1)
        {
          this.loadMoreCheck = true; // no more posts
        }
        else{
          this.pushPost(data.json());
        }
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
  postID(event) {
    this.post_id = event;
  }
  onScroll() {
    if(!this.loadMoreCheck)
    {
      this.offset = this.offset + this.limit;
      this.fetchFeed();
    }
  }
  deleteVar = function deletePost(id)
  {
    this.postServicesService.deletePost(id)
    .subscribe(data => {
      let res = data.json()
      var index = this.posts.find(x => x.id = res.id)
      this.posts.splice(index, 1);
    })
  }
}
