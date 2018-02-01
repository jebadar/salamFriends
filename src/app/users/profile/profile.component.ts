import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { ProfileHomeComponent } from '../profile-home/profile-home.component';
import { ProfileAboutComponent } from '../profile-about/profile-about.component';
import { ProfileFriendsComponent } from '../profile-friends/profile-friends.component'
import { ProfilePhotosComponent } from '../profile-photos/profile-photos.component'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServicesService } from '../user-services.service';
import { AddFriendComponent } from '../add-friend/add-friend.component'
import { Constants } from '../../constants'
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component'

const URL = Constants.MEDIA_URL;
const Assets_URL = Constants.ASSET_URL;
const Store_URL = Constants.STORAGE_URL;

@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('uploadButton') fileRef: ElementRef;
  public uploader: FileUploader;
  asset_url = Assets_URL;

  btnProfilePic = false;
  profilePicCheck = false;
  coverPicCheck = false;
  imageResponse = false;
  searchCheck = false;
  hideAbout = true;
  isDisabled = false;
  uploadFlag = false;
  hide = true;
  loading = false;
  profileResponse = false;
  profileLoading = false;
  userNotFoundCheck = false;
  myprofile: boolean;
  detectmob: boolean;

  imgCoverAdd: string;
  imgProfileAdd: string;
  media_id: string;
  accessTokken: string;
  data = {};
  urlRoute: string;
  id: string;
  fullName: string;
  profilePic

  post: any = {};
  user: any = {};
  userBasicInfo: any = {};


  progress_upload = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userServicesService: UserServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer
  ) {
    this.accessTokken = this.userServicesService.getTokken();

    this.initUploader();
    this.myprofile = true;

    this.uploader.onAfterAddingFile = (file) => {
      file.alias = "picture";
      if (this.profilePicCheck) {
        this.profileLoading = true;
      }
      else {
        this.loading = true;
        this.isDisabled = true;
      }
      this.fileRef.nativeElement.click();
    }
    this.uploader.onProgressAll = (progress: any) => {
      this.progress_upload = progress;
    }
    this.uploader.onErrorItem = (file) => {
      this.loading = false;
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response);

    if (this.profilePicCheck) {
      this.imgProfileAdd = data.path;
      this.profileLoading = false;
      this.profileResponse = true;
    }
    else if (this.coverPicCheck) {
      this.imgCoverAdd = data.path;
      this.loading = false;
      this.imageResponse = true;
      this.isDisabled = false;
    }
    this.media_id = data.media_id;
  }
  initUploader() {
    this.uploader = new FileUploader({ url: URL });
    this.uploader.authToken = this.accessTokken;
    var uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value: 'Bearer ' + this.accessTokken }]
    this.uploader.setOptions(uo);
  }
  ngOnInit() {
    this.imgCoverAdd = Assets_URL + "images/profile-cover-image.png";
    this.imgProfileAdd = Assets_URL + "images/member-1.jpg";
    this.searchCheck = this.activatedRoute.snapshot.data['searchCheck'];;
    this.detectmob = this.userServicesService.detectmob();
    if (this.searchCheck) {
      this.activatedRoute.params.subscribe((params: Params) => {
        if (params.id) {
          this.myprofile = false;
          this.id = params.id;
          this.hideAbout = false;
        }
      });
    }
    this.getUserInfo();
  }

  getUserInfo() {
    if (this.myprofile) {
      this.user = JSON.parse(this.userServicesService.getUserInfo());
      this.populateFields(this.user);
      this.id = this.user.id;
      this.urlRoute = 'profile';
    } else {
      this.urlRoute = this.id;
    }
    this.userServicesService.getUser(this.id)
      .subscribe(
      data => {
        this.user = data;
        this.populateFields(this.user);
      },
      error => {
        this.userNotFoundCheck = true;
      }
      );
  }
  populateFields(userData) {
    this.imgCoverAdd = userData.coverImageLink;
    this.imgProfileAdd = userData.profileImageLink;
    this.fullName = userData.f_name + " " + userData.l_name;
  }
  PicCheck(flag) {
    if (flag == 'profile') {
      this.profilePicCheck = true;
      this.coverPicCheck = false;
    }
    else if (flag == 'cover') {
      this.profilePicCheck = false;
      this.coverPicCheck = true;
    }
  }
  changeBtn(flag) {
    this.btnProfilePic = flag;
  }
  submitPicData() {
    if (this.profilePicCheck) {
      this.profileLoading = true;
    } else {
      this.loading = true;
    }
    let tempUser = this.generateTempUser();
    this.userServicesService.putUser(tempUser, tempUser.id)
      .subscribe(data => {
        this.loading = false;
        this.imageResponse = false;
        this.profileLoading = false;
        this.profileResponse = false;
      },
      error => {
        this.populateFields(this.user);
        this.loading = false;
        this.imageResponse = false;
        this.profileLoading = false;
        this.profileResponse = false;
      });
  }
  generateTempUser() {
    let _user: any = {}
    _user = JSON.parse(this.userServicesService.getUserInfo());
    if (this.coverPicCheck) {
      _user.cover_id = this.media_id;
    }
    else if (this.profilePicCheck) {
      _user.img_id = this.media_id;
    }
    return _user;
  }
  routerLink(key) {
    switch (key) {
      case 'profile':
        if (this.searchCheck) {
          return this.router.navigate(['user/' + this.id + '/']);
        }
        else {
          return this.router.navigate(["profile"]);
        }
      case 'about':
        {
          if (this.searchCheck) {
            return this.router.navigate(['user/' + this.id + '/about']);
          }
          else {
            return this.router.navigate(["profile/about"]);
          }
        }
      case 'friends':
        {
          if (this.searchCheck) {
            return this.router.navigate(['user/' + this.id + '/friends']);
          }
          else {
            return this.router.navigate(['profile/friends']);
          }
        }
      case 'photos':
        {
          if (this.searchCheck) {
            return this.router.navigate(['user/' + this.id + '/photos']);
          }
          else {
            return this.router.navigate(['profile/photos']);
          }
        }
      case 'activity':
        {
          return this.router.navigate(['activity']);
        }
    }
  }
}

