import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../constants'
import { UserServicesService } from '../user-services.service';
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DpComponent } from '../../shared/dp/dp.component'
import { AddFriendComponent } from '../add-friend/add-friend.component'
import { LoaderComponent } from '../../shared/loader/loader.component'

@Component({
  selector: 'friends-component',
  templateUrl: './friends.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})

export class FriendsComponent implements OnInit {
  @Input() userId;
  @Input() tabFriend:boolean;
  @Input() searchCheck;
  user: any = {};
  friendList: Array<friendObj> = [];
  Store_URL = Constants.STORAGE_URL;
  Assets_URL = Constants.ASSET_URL;
  tabCheck = false;
  friendlistCheck = true;
  friends:any = {};
  loading = false;
  unfriendCheck = false;
  btnText = "";
  classFlag = true;
  loadBtnCheck = false;
  emptyCheck = false;//no friends in list
  constructor(
    private userServicesService: UserServicesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.setFlag();
    this.initFriendList();
    this.loading = false;
  }
  setFlag()
  {
    if(this.tabFriend != undefined)
      {
        this.tabCheck = this.tabFriend;
      }
  }
  initFriendList(){
    if(this.userId != undefined){
      this.userServicesService.getFriendsById(this.userId)
      .subscribe(data => {
        let list = data.json();
        this.friendList = this.processFriendsList(list.Friends);
        if(this.friendList.length > 6)
        {
          this.loadBtnCheck = true;
        }
        else if(this.friendList.length < 1)
        {
          this.emptyCheck = true;
        }
      })
    }
  }

  navigateToUser(id) {
    let profileLink = 'user/' + id;
    this.router.navigate([profileLink]);
  }
  viewAllFriends()
  {
    if(this.searchCheck)
    {
      this.router.navigate(['user/'+this.userId+'/friends']);
    }
    else{
      this.router.navigate(['profile/friends']);
    }
  }

  processFriendsList(list){
    let frieldsArr = Array();
    let currentUserId;
    if(this.userId != undefined)
    {
      currentUserId = this.userId;
    }
    else
    currentUserId = this.userServicesService.getLogedInUserId();

    if(list.length>0){
      list.forEach(item=>{
        if(item.status=="accept"){
          let friend:any = {};
          friend = (item.sender_id==currentUserId)?item.user1[0]:item.user2[0];
          frieldsArr.push({
            profile_pic: friend.profile_pic,
            name: friend.f_name+" "+friend.l_name,
            id: friend.id
          });
        }
      });
    }
    return frieldsArr;
  }


}
interface friendObj {
  profile_pic: string,
  name: string,
  id: string
}