import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserServicesService } from '../../users/user-services.service';
import { CommentServicesService } from '../comment-services.service';
import { Constants } from '../../constants'
import { DpComponent } from '../../shared/dp/dp.component'
import { ConfirmModalComponent } from '../../posts/confirm-modal/confirm-modal.component';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'display-comment',
  templateUrl: './display.component.html',
  styleUrls: ['../../posts/timeline/timeline.component.css']
})
export class DisplayComponent implements OnInit {
  @Input() comment;
  @Input() counter;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  constructor(
    private userServicesService: UserServicesService,
    private commentServicesService: CommentServicesService,
    private dialogService: DialogService
  ) { }

  editFlag = false;
  data = {};
  comm: string;
  commentInput: string;
  asset_url = Constants.ASSET_URL;

  commentUser;
  loggedUser;
  fullName;
  enableEditBtn = false;

  ngOnInit() {
    this.checkUser()
    this.commentUser = this.comment.user;
    this.loggedUser = JSON.parse(this.userServicesService.getUserInfo());
    if (this.commentUser == undefined) {
      this.fullName = this.loggedUser.f_name + ' ' + this.loggedUser.l_name;
    }
    else {
      this.fullName = this.commentUser.f_name + ' ' + this.commentUser.l_name;
      if (this.loggedUser.id == this.commentUser.id) {
        this.enableEditBtn = true;
      }
    }
  }
  checkUser() {
    if (this.comment.user === undefined && this.comment.user_id) {
      this.comment.user = JSON.parse(this.userServicesService.getUserInfo());
    }
  }
  edit() {
    this.editFlag = true;
    this.comm = this.comment.description;
  }
  delete() {
    this.commentServicesService.deleteComment(this.comment)
      .subscribe(data => {
        this.deleted.emit(this.comment.id);
      }, // Reach here if res.status >= 200 && <= 299
      err => {
      });
  }
  confirm() {
    let confirm: boolean
    let disposable = this.dialogService.addDialog(ConfirmModalComponent, {
      confirm: confirm
    })
      .subscribe((delete_flag) => {
        //We get dialog result
        if (delete_flag) {
          this.delete();
        }
      });
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.data = {
        "comment":
          {
            "id": this.comment.id,
            "user_id": this.comment.user_id,
            "post_id": this.comment.post_id,
            "status": "1",
            "description": this.comm

          }
      }
      this.commentServicesService.editComment(this.data)
        .subscribe(data => {
          this.comment.description = this.comm;
          this.editFlag = false;
        }, // Reach here if res.status >= 200 && <= 299
        err => {
        }
        );
    } else if(event.keyCode === 27) {
      this.editFlag = false;
    }
  }
  cancelEdit() {
    this.editFlag = false;
  }
}
