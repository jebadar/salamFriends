import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServicesService } from '../user-services.service';

@Component({
  selector: 'add-friend-component',
  templateUrl: './add-friend.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class AddFriendComponent implements OnInit {
  @Input() friendlistCheck: boolean
  @Input() selfProfile: boolean
  @Input() userId
  @Input() InlineCheck:boolean
  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private userServicesService: UserServicesService
  ) { }
  searchCheck = false;
  loading = false;
  isDisabled = false;
  id;
  userInfo: any = {};
  buttonText = "Add Friend";
  blockBtn = "Block"
  addFriendCheck = true;
  unFriendCheck = false;
  user: any = {};
  friends: any = {};
  freindRequest = false;
  friendId: number;
  acceptRqstCheck = false;
  cancelRqstCheck = false;
  blockCheck = false;
  pendingCheck = false;
  myBox = false;
  btnClass:string;
  detectmob:boolean;
  ngOnInit() {
    //this.loading = true;
    this.detectmob = this.userServicesService.detectmob();
    this.user = JSON.parse(this.userServicesService.getUserInfo());
    this.initFlags();
    this.initClass(this.InlineCheck)
    if (this.selfProfile == false) {
      this.id = this.userId;
      this.checkUser(this.id)
    }
    if (this.friendlistCheck) {
      //this.buttonText = "Unfriend";
      //this.unFriendCheck = true;
      //this.loading = false;
      this.checkUser(this.userId)
    }
  }
  initClass(flag){
    if(flag)
    {
      this.btnClass = "upload-botton-inline"
    }
    else
      this.btnClass ="upload-botton"
  }
  initFlags()
  {
    this.acceptRqstCheck = false;
    this.cancelRqstCheck = false;
    this.blockCheck = false;
    this.pendingCheck = false;
    this.freindRequest = false; 
    this.addFriendCheck = true;
    this.unFriendCheck = false;
  }
  checkUser(id) {
    this.userServicesService.getUser(id)
      .subscribe(
      data => {
        this.userInfo = data;
        this.loading = false;
        if (this.userInfo.block != undefined) {
          if (this.userInfo.block.length > 0) {
            this.userInfo.block.forEach(item => {
              if (item.block != "") {
                this.blockCheck = true;
                this.blockBtn = "Unblock";
              }
            });
          }

          if (this.userInfo.friendsbyreceiver.length > 0) {
            this.userInfo.friendsbyreceiver.forEach(item => {
              if (item.sender_id == this.user.id) {
                this.friendId = item.id
                if (item.status == "accept") {
                  this.buttonText = "Unfriend";
                  this.unFriendCheck = true;
                  this.addFriendCheck = false;
                  this.acceptRqstCheck = false;
                  this.cancelRqstCheck = false;
                }
                else if (item.status == "pending") {
                  this.buttonText = "Pending";
                  this.pendingCheck = true;
                  this.cancelRqstCheck = true;
                  this.unFriendCheck = false;
                  this.addFriendCheck = false;
                  this.acceptRqstCheck = false;
                }
                else if (item.status == "cancel") {
                  this.buttonText = "Add Friend";
                  this.addFriendCheck = true;
                  this.unFriendCheck = false;
                  this.acceptRqstCheck = false;
                  this.cancelRqstCheck = false;
                }
                else if (item.status == "delete") {
                  this.buttonText = "Add Friend";
                  this.addFriendCheck = true;
                  this.unFriendCheck = false;
                  this.acceptRqstCheck = false;
                  this.cancelRqstCheck = false;
                }
              }
            })
          }
          if (this.userInfo.friendsbysender.length > 0) {
            this.userInfo.friendsbysender.forEach(item => {
              if (item.receiver_id == this.user.id) {
                this.friendId = item.id
                if (item.status == "accept") {
                  this.buttonText = "Unfriend";
                  this.unFriendCheck = true;
                  this.addFriendCheck = false;
                  this.cancelRqstCheck = false;
                  this.acceptRqstCheck = false;
                }
                else if (item.status == "pending") {
                  this.buttonText = "Accept request";
                  this.acceptRqstCheck = true;
                  this.unFriendCheck = false;
                  this.addFriendCheck = false;
                  this.cancelRqstCheck = false;
                }
                else if (item.status == "cancel") {
                  this.buttonText = "Add Friend";
                  this.addFriendCheck = true;
                  this.unFriendCheck = false;
                  this.acceptRqstCheck = false;
                  this.cancelRqstCheck = false;
                }
                else if (item.status == "delete") {
                  this.buttonText = "Add Friend";
                  this.addFriendCheck = true;
                  this.unFriendCheck = false;
                  this.acceptRqstCheck = false;
                  this.cancelRqstCheck = false;
                }
              }
            })
          }
        }
        else {
          this.myBox = true;
        }
      })
  }
  cancelRqst(value) {
    this.loading = true;
    this.isDisabled = true;
    if (value == 'cancel') {
      if (this.cancelRqstCheck) {
        this.friends.status = "cancel";
        this.userServicesService.unFriend(this.friends, this.userInfo.id)
          .subscribe(data => {
            let response = data.json();
            this.buttonText = "Add Friend";
            this.unFriendCheck = false;
            this.addFriendCheck = true;
            this.acceptRqstCheck = false;
            this.cancelRqstCheck = false;
            this.loading = false;
            this.isDisabled = false;
          },
          error => {
            let errorRes = error.json();
            this.loading = false;
            this.isDisabled = false;
          })
      }
    }
    else if (value == 'reject') {
      this.loading = true;
      this.friends.status = "delete";
      this.isDisabled = true;
      this.userServicesService.unFriend(this.friends, this.userInfo.id)
        .subscribe(data => {
          let response = data.json();
          this.buttonText = "Add Friend";
          this.unFriendCheck = false;
          this.addFriendCheck = true;
          this.acceptRqstCheck = false;
          this.cancelRqstCheck = false;
          this.loading = false;
          this.isDisabled = false;
        },
        error => {
          let errorRes = error.json();
          this.loading = false;
          this.isDisabled = false;
        })
    }
  }
  addFriendClick() {
    let id;
    if (this.unFriendCheck) {
      this.friends.status = "delete";
      this.loading = true;
      this.isDisabled = true;
      if (this.friendlistCheck) {
        id = this.userId
      }
      else {
        id = this.userInfo.id
      }
      this.userServicesService.unFriend(this.friends, id)
        .subscribe(data => {
          let response = data.json();
          this.buttonText = "Add Friend";
          this.unFriendCheck = false;
          this.addFriendCheck = true;
          this.acceptRqstCheck = false;
          this.cancelRqstCheck = false;
          this.loading = false;
          this.isDisabled = false;
        },
        error => {
          let errorRes = error.json();
          this.loading = false;
          this.isDisabled = false;
        })
    }
    else if (this.addFriendCheck) {
      this.loading = true;
      this.isDisabled = true;
      this.friends.sender_id = this.user.id.toString();
      this.friends.receiver_id = this.userInfo.id.toString();
      this.friends.status = "pending";
      this.userServicesService.addFriend(this.friends)
        .subscribe(data => {
          let response = data.json();
          this.buttonText = "Pending";
          this.unFriendCheck = false;
          this.addFriendCheck = false;
          this.acceptRqstCheck = false;
          this.cancelRqstCheck = true;
          this.loading = false;
          this.isDisabled = false;
        },
        error => {
          this.loading = false;
          this.isDisabled = false;
        })
    }
    else if (this.acceptRqstCheck) {
      this.loading = true;
      this.isDisabled = true;
      this.friends.status = "accept";
      this.userServicesService.unFriend(this.friends, this.userInfo.id)
        .subscribe(data => {
          let response = data.json();
          this.buttonText = "Unfriend";
          this.unFriendCheck = true;
          this.addFriendCheck = false;
          this.acceptRqstCheck = false;
          this.cancelRqstCheck = false;
          this.loading = false;
          this.isDisabled = false;
        },
        error => {
          let errorRes = error.json();
          this.loading = false;
          this.isDisabled = false;
        })
    }
  }
  blockUser() {
    this.loading = true;
    this.isDisabled = true;
    if (this.blockCheck) {
      this.userServicesService.unblockUser(this.userInfo.id)
        .subscribe(data => {
          let res = data.json();
          this.blockCheck = false;
          this.blockBtn = "Block"
          this.loading = false;
          this.isDisabled = false;
        },
        error => {
          this.loading = false;
          this.isDisabled = false;
        })
    }
    else {
      this.userServicesService.blockUser(this.userInfo.id)
        .subscribe(data => {
          this.loading = false;
          let res = data.json();
          this.blockCheck = true;
          this.blockBtn = "Unblock"
          this.isDisabled = false;
        },
        error => {
          this.loading = false;
          this.isDisabled = false;
        })
    }
  }
}
