import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { PhotosComponent } from '../photos/photos.component';
import { FriendsComponent } from '../friends/friends.component';
import { PostWrapperComponent } from '../post-wrapper/post-wrapper.component'
import { UserServicesService } from '../user-services.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TimelineComponent } from '../../posts/timeline/timeline.component';
import { Constants } from  '../../constants'
import { PagesBoxComponent } from '../pages-box/pages-box.component';

@Component({
  selector: 'profile-home-component',
  templateUrl: './profile-home.component.html',
  styleUrls: ['./profile-home.component.css']
})
export class ProfileHomeComponent implements OnInit {

  constructor(
    private userServicesService: UserServicesService,
    private activatedRoute: ActivatedRoute
  ) { }

  loading = false;
  infoArray: Array<info>
  subinfoIds = [];
  detailArray = [];
  searchCheck = false;
  userLoaded: boolean = false;
  user_id: string;
  post_id: number = 0;
  asset_url = Constants.ASSET_URL;
  detectmob:boolean
  ngOnInit() {
    this.searchCheck = this.activatedRoute.snapshot.data['searchCheck'];
    this.loading = true;
    this.userLoaded = true;
    this.detectmob = this.userServicesService.detectmob();
    this.fetchInfo();
    if (this.searchCheck) {
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.id) {
          this.user_id = params.id;
          this.fetchInfoDetail(params.id)
        }
      })
    }
    else {
      this.user_id = this.userServicesService.getLogedInUserId();

      this.fetchInfoDetail(this.user_id)
    }
  }
  fetchInfo()
  {
    let metadata
    this.userServicesService.getMetadataInfo()
    .subscribe(data => {
      metadata = data.json();
      this.initMetadata(metadata);
      this.loading = false;
    })
  }
  fetchInfoDetail(userId)
  {
    let metaDetail;
    this.userServicesService.getMetaDetail(userId)
    .subscribe(data => {
      metaDetail = data;
      this.initDetailArr(metaDetail)
    })
  }
  initMetadata(metaData)
  {
    if (metaData.info.metadata == undefined || metaData.info.metadata == null) {
      this.infoArray = metaData.info
    }
    else {
      this.infoArray = metaData.info.metadata;
    }
    this.infoArray.forEach(item => {
      if(item.subinfo !== undefined) {
        let subInfo = [];
        subInfo = item.subinfo;
        subInfo.forEach(item => {
          this.subinfoIds.push({
          id: item.id
          })
        }) 
      }
    }) 
  }
  initDetailArr(detailArrMine) {
    // if (detailArrMine != null || detailArrMine != undefined) {
    //   if (detailArrMine.length != 0) {
    //     this.infoArray.forEach(item => {
    //       let title = [];
    //       for (let counter = 0; counter < this.subinfoIds.length; counter++) {
    //           if (detailArrMine[counter].info_id == this.subinfoIds[counter].id) {
    //             title.push(detailArrMine[counter].description);
    //           }
    //           this.detailArray.push(title);
    //       }
    //     }) 
    //   }
    // }


    if (detailArrMine.length != 0) {
      let title = [];
      detailArrMine.forEach(item => {
        title.push(item.description);
      })
      this.detailArray.push(title);
    }

  }

  postID(event) {
    this.post_id = event;
  }
}
interface info {
  id: number,
  status: string,
  title: string,
  update_at: string,
  subinfo: Array<string>
}
interface userDetail {
  info_id: string,
  privace: string,
  description: string
}
