import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { UserServicesService } from '../../users/user-services.service';
import { PostServicesService } from '../post-services.service';
import { Constants } from '../../constants'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component'
import { StatusService } from '../../shared/status-service/status.service'

const Store_URL = Constants.STORAGE_URL;

@Component({
  selector: 'timeline-component',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() post_id;
  @Input() pageId;
  @Input() searchCheck;
  @Input() userId;
  @Input() pagePostsTab;
  result = [];
  posts: Array<string> = [];
  length: number = 0;
  resp: any;
  arr: any = {};
  user: any = {};
  userBasicInfo: any = {};
  imgProfile: string;
  endText: string;
  checkToSend = true;
  store_url = Constants.STORAGE_URL;
  loader = false;
  limitOfPost = 5;
  offsetOfPost = 0;
  myProfile: boolean;
  loadMoreCheck = false; // by default load more
  pageCheck = false; // by default its not page timeline

  constructor(
    private userServicesService: UserServicesService,
    private postServicesService: PostServicesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private statusService: StatusService
  ) { }

  ngOnInit() {
    this.myProfile = true; //byDefault its my profile.
     if(this.searchCheck) {
          this.myProfile = false;
          this.loader = true;
    }
    if(this.searchCheck == undefined && this.userId == undefined && this.pageId != undefined)
    {
      this.pageCheck = true;
      let pageObserve = this.getAdmin();
      pageObserve.subscribe(data=>{
        this.getUserPostsById();  
      },error=>{});
    }
    else if( this.userId != undefined && this.pageId == undefined)
    {
      let userObserve = this.getUser();
      userObserve.subscribe(data=>{
        this.getUserPostsById();  
      },error=>{});
    }
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
  getAdmin()
  {
    return new Observable(observer => {
      this.loader = true;
        this.postServicesService.getPagebyId(this.pageId)
        .subscribe(
          data => {
            let page = data.json();
            this.loader = false;
            observer.next(page);
          },
          error=>{
            this.loader = false;
            observer.error(error);
          }
        );
    });
  }

  getUser(){
    return new Observable(observer => {
      if(this.myProfile == true){
        this.user = JSON.parse(this.userServicesService.getUserInfo());
        // this.imgProfile = this.store_url + this.user.profile_pic[0].picture.path;
        // this.imgProfile = user.profileImageLink;
        // // this.imgCoverAdd = userData.coverImageLink;
        // // this.imgProfile = userData.profileImageLink;
        observer.next(this.user);
      } else{
        this.loader = true;
        this.userServicesService.getUser(this.userId)
        .subscribe(
          data => {
            this.user = data;
            this.loader = false;
            observer.next(data);
          },
          error=>{
            this.loader = false;
            observer.error(error);
          }
        );
      }  
    });
  }
  getUserPostsById() {
    let target = "";
    let observer;
    let limit = "";
    let offset = "";
    if(!this.pageCheck || this.pageCheck == undefined)
    {
      target = "self"
      observer = this.postServicesService.getUserPostsById(this.user.id,this.limitOfPost, this.offsetOfPost,target,this.pagePostsTab)
    }
    else if(this.pageCheck)
    {
      target = "page"
      observer = this.postServicesService.getUserPostsById(this.pageId,this.limitOfPost, this.offsetOfPost,target,this.pagePostsTab)
    }
    this.loader = true;    
    observer.subscribe(data => {
        if(this.posts.length < 1){
          this.posts = data
        }
        else
        {
          let postsTemp = data
          if(postsTemp.length < 1)
          {
            this.loadMoreCheck = true; // no more posts
          }
          else{
            this.pushPost(data);
          }
        }
        this.loader = false;
      }, error => {
        this.loader = false;
      });
}
 pushPost(postArr)
 {
  postArr.forEach(item => {
    this.posts.push(item);
  });
 }
  onScroll() {
    if(!this.loadMoreCheck)
    {
      this.offsetOfPost = this.offsetOfPost + this.limitOfPost;
      this.getUserPostsById();
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
