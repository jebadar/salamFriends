import { Component, OnInit } from '@angular/core';
import { Constants } from  '../../constants'
import { PhotosComponent } from '../photos/photos.component'
import { UserServicesService } from '../user-services.service'
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'profile-photos-component',
  templateUrl: './profile-photos.component.html',
  styleUrls: ['./profile-photos.component.css']
})
export class ProfilePhotosComponent implements OnInit {

  constructor(
    private userServicesService: UserServicesService,
    private activatedRoute: ActivatedRoute
  ) { }
  asset_url = Constants.ASSET_URL;
  tabPhotos = true;
  searchCheck = false;
  userId:number;
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
