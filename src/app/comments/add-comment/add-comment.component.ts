import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserServicesService } from '../../users/user-services.service';
import { CommentServicesService } from '../comment-services.service';
import { Constants } from '../../constants'
import { DpComponent } from '../../shared/dp/dp.component'
import { LoaderComponent } from '../../shared/loader/loader.component'

const Asset_URL = Constants.ASSET_URL;

@Component({
  selector: 'add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['../../posts/timeline/timeline.component.css']
})
export class AddCommentComponent implements OnInit {
@Input() comments;
@Input() post;

  comment = {};
  user: string;
  comm: string;
  commentInput:string = '';
  asset_url = Asset_URL;
  widthPic = 40 
  loading = false;
  constructor(
    private userServicesService: UserServicesService,
    private commentServicesService: CommentServicesService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(this.userServicesService.getUserInfo())
  }

  keyDownFunction(event, postID, counter) {
    if (event.keyCode == 13) {
      this.comment = {
        "mediaId": 0,
        "post_id": postID,
        "user_id": this.user['id'],
        "description": this.comm,
        "status": "1"
      }
      this.loading = true;
      this.commentServicesService.postComment(this.comment)
        .subscribe(data => {
          this.comments.push(data.json());
          this.commentInput=" ";
          this.comm=" ";
          this.loading = false;
        }, // Reach here if res.status >= 200 && <= 299
        err => {
        }
        );

    }
  }

}
