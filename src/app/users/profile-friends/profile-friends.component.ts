import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants'
import { UserServicesService } from '../user-services.service'
import { ActivatedRoute, Params } from '@angular/router';
import { FriendsComponent } from '../friends/friends.component'

const Store_URL = Constants.STORAGE_URL;
const Assets_URL = Constants.ASSET_URL;
@Component({
  selector: 'app-profile-friends',
  templateUrl: './profile-friends.component.html',
  styleUrls: ['./profile-friends.component.css']
})

export class ProfileFriendsComponent implements OnInit {
  userId:number;
  friendTab = true;
  constructor(
    private userServicesService: UserServicesService,
    private activatedRoute: ActivatedRoute
  ) {
  }
  asset_url = Constants.ASSET_URL;
  searchCheck = false;
  ngOnInit() {
    this.searchCheck = this.activatedRoute.snapshot.data['searchCheck'];
    if (!this.searchCheck) {
      this.userId = this.userServicesService.getLogedInUserId();
    }
    else if (this.searchCheck) {
      let url;
      this.activatedRoute.parent.params.forEach((params:Params) => {
        url = params['url'];
        this.userId = +params['id'];
        });
      
    }
  }

}

