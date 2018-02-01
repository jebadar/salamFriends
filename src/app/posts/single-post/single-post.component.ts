import { Component, OnInit, Input } from '@angular/core';
import { Lightbox } from 'angular2-lightbox';
import { UserServicesService } from '../../users/user-services.service';
import { DisplayComponent } from '../../comments/display/display.component';
import { AddCommentComponent } from '../../comments/add-comment/add-comment.component'
import { Observable } from 'rxjs/Rx';
import { PostServicesService } from '../post-services.service';
import { Constants } from '../../constants'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component'
import { DpComponent } from '../../shared/dp/dp.component'
import { BsDropdownModule } from 'ngx-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'single-post-component',
  templateUrl: './single-post.component.html',
  styleUrls: ['../timeline/timeline.component.css']
})

export class SinglePostComponent implements OnInit {
  @Input() post;
  @Input() postCheck;
  @Input() adminData;
  @Input() deleteRefer;
  user: any = {};
  infoArray: Array<string>;
  comm: string;
  post_id = 0;
  data = {};
  comment = {};
  like = {};
  comments = [];
  nameLiked = "";
  likes: number;
  flag = false;
  view_flag = true;
  store_url = Constants.STORAGE_URL;
  asset_url = Constants.ASSET_URL;
  loader = false;
  _albums = [];
  _lightbox: Lightbox;
  imgProfile: String;
  width:number = 80;
  likeFieldTxt = "";
  clickCount = 0;
  editPostCheck = false;
  pagePost = false;
  page;
  constructor(
    private userServicesService: UserServicesService,
    private postServicesService: PostServicesService,
    private route: ActivatedRoute,
    private router: Router,
    _lightbox: Lightbox,
    private dialogService:DialogService
  ) {
    this._lightbox = _lightbox;
    this.imgProfile = this.asset_url + "images/member-1.jpg";
  }
  ngOnInit() {
    this.loader = true;
    console.log(this.post);
    this.postSubfield();
    if(this.post.media.length>0){
      if(this.post.media[0].media_type=="picture"){
        const album = {
          src: this.store_url+this.post.media[0].picture.path,
          caption: this.post.content
        };
        this._albums.push(album);
      }
    }
  }
  countClick()
  {
    this.clickCount++;
    console.log('multipleEvent');
  }
  // checkAdminPost()
  // {
  //   if(this.post.belongs_to == "page")
  //   {
  //     this.postServicesService.getPagebyId(this.post.belong_id)
  //     .subscribe(data => {
  //       this.page = data.json()
  //       if(this.page.admins[0].user_id == this.post.user_id)
  //       {
  //         this.user.f_name = this.page.title;
  //         this.imgProfile = this.page.profile_pic;
  //         this.loader = false;
  //         return true
  //       }
  //       else
  //       {
  //         this.pagePost = true;
  //         return false;
  //       } 
  //     })
  //   }
  //   else 
  //   return false;
  // }
  postSubfield()
  {
    this.getComments();
    this.getlikes(this.post.likes);
   
    if(this.post.belongs_to == "page")
    {
      this.postServicesService.getPagebyId(this.post.belong_id)
      .subscribe(data => {
        this.page = data.json()
        this.user.f_name = this.page.title;
        this.imgProfile = this.page.profile_pic;
        this.loader = false;
      })
    }
   else{
      this.userServicesService.getUser(this.post.user_id)
      .subscribe(
        data => {
          this.user = data;
          this.imgProfile = this.user.profile_pic;
          this.loader = false;
        },
        error=>{
          this.loader = false;
        });}
  }


  openImage(index: number): void {
    // open lightbox 
    // debugger;
    this._lightbox.open(this._albums, index);
  }

  likePost(postID, counter) {
    this.like = {
      "post_id": postID,
      "user_id": this.user['id'],
      "status": "1"
    }
    if(this.clickCount == 1){
      this.postServicesService.likePost(this.like)
        .subscribe(data => {
          this.post['likes'].push(data.json());
          this.getlikes(this.post.likes)
          this.clickCount = 0
        }, // Reach here if res.status >= 200 && <= 299
        err => {
          this.clickCount = 0
          }
        );
      }
  }

  unlikePost(postID, counter) {
    if(this.clickCount == 1){
      this.postServicesService.unlikePost(postID)
        .subscribe(data => {
          this.clickCount = 0
          this.post['likes'].splice(counter, 1);
          this.getlikes(this.post.likes);
        }, // Reach here if res.status >= 200 && <= 299
        err => {
          this.clickCount = 0
        }
        );
      }
  }

  getComments() {
    this.comments = [];
    if (this.post.comment.length > 2) {
      this.comments[0] = this.post.comment[this.post.comment.length - 1];
      this.comments[1] = this.post.comment[this.post.comment.length - 2];
    }
    else {
      this.comments = this.post.comment;
    }
    this.view_flag = true;
  }
  getlikes(likesArr) {
    this.likeFieldTxt = "";
    this.flag = false;
    let count = 0;
    if(likesArr.length > 0){
      if(likesArr[0].user_id != this.userServicesService.getLogedInUserId())
      {
        this.likeFieldTxt = likesArr[0].user.f_name +" "+likesArr[0].user.l_name;
        count++;
      }
      else if(likesArr[0].user_id == this.userServicesService.getLogedInUserId() && likesArr.length > 1){
        this.likeFieldTxt = likesArr[1].user.f_name +" "+likesArr[1].user.l_name;
        count++;
      }
    }
    likesArr.forEach(item => {
      if (item.user_id === this.userServicesService.getLogedInUserId()){
        this.flag = true;
        if(this.likeFieldTxt == ""){
          this.likeFieldTxt =  "You" + this.likeFieldTxt;
          count++;
        }
        else{
           this.likeFieldTxt =  "You" + ","+this.likeFieldTxt;
           count++;
        }
      }
    })
    if(likesArr.length >1)
    { 
      count = likesArr.length - count
      if(count > 0){
        this.likeFieldTxt = this.likeFieldTxt + " and "+count +" others ";
      }
    }
  }

  viewAllComments() {
    this.comments = this.post.comment;
    this.view_flag = false;
  }

  deleteComment(event) {
    for (var i = 0; i < this.post.comment.length; i++) {
      if (event == this.post.comment[i].id) {
        this.post.comment.splice(i, 1);
        break;
      }
    }
    for (var i = 0; i < this.comments.length; i++) {
      if (event == this.comments[i].id) {
        this.comments.splice(i, 1);
        break;
      }
    }
  }

  navigateToUser(id) {
    let logedInUserId = this.userServicesService.getLogedInUserId();
    if (logedInUserId == id) {
      this.router.navigate(['profile']);
    }
    else {
      let value = 'user/' + id;
      this.router.navigate([value]);
    }

  }
  editPost()
  {
    this.editPostCheck = true;
  }
  closeEdit()
  {
    this.editPostCheck = false;
  }
  submitEdit()
  {
    console.log(this.post)
    this.postServicesService.editPost(this.post)
    .subscribe(data => {
      this.post = data.json();
      this.editPostCheck = false;
      
    })
  }
  selfDeleted = false;
  confirm()
  {
    let confirm : boolean
      let disposable = this.dialogService.addDialog(ConfirmModalComponent, {
          confirm:confirm})
          .subscribe((delete_flag)=>{
              //We get dialog result
              if(delete_flag) {
                this.deleteRefer(this.post.id)
                this.selfDeleted = true;
              }
              else {
              }
          });
      //We can close dialog calling disposable.unsubscribe();
      //If dialog was not closed manually close it by timeout
      // setTimeout(()=>{
      //     disposable.unsubscribe();
      // },10000);
  
  }

}
