import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServicesService } from '../../users/user-services.service'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';


@Component({
  selector: 'page-main-component',
  templateUrl: './page-main.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PageMainComponent implements OnInit {
  @Input() pageDataInput;
  @Input() id;
  @Input() likedCheck;
  @Input() margin;
  @Input() adminCheck;
  
  @ViewChild('uploadButton') fileRef: ElementRef;
  public uploader: FileUploader;
  imgAddress: string;
  coverAddress: string;
  asset_url = Constants.ASSET_URL;
  hideBox = false;
  disabled = false;
  hide = true;
  detectmob = this.pageService.detectmob();
  accessTokken = "";
  URL = Constants.MEDIA_URL;
  //profile, cover picture handling Flags
  profilePicCheck = false;
  coverPicCheck = false;
  imgProfileAdd = "";
  profileLoading = false;
  profileResponse = false;
  imgCoverAdd = "";
  loading = false;
  imageResponse = false;
  isDisabled = false;
  media_id = "";
  // FLags End
  constructor(
    private pageService: PageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserServicesService,
    private toastr: ToastsManager
  ) {
    this.accessTokken = this.userService.getTokken();
    this.uploader = new FileUploader({ url: this.URL });
    this.uploader.authToken = this.accessTokken;
    var uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value: 'Bearer ' + this.accessTokken }]
    this.uploader.setOptions(uo);

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
    this.uploader.onErrorItem = (file) => {
      this.loading = false;
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
   }

  ngOnInit() {
    this.imgProfileAdd = this.asset_url + "images/member-1.jpg";
    this.imgCoverAdd = this.asset_url + "images/profile-cover-image.png";
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

    //success server response
  }
  likePage() {
    let resp;
    this.disabled = true;
    let like = {
      page_id: this.id,
      user_id: this.userService.getLogedInUserId(),
      notification: "1",
      status: "1"
    }
    this.pageService.likePage(like)
      .subscribe(data => {
        resp = data.json();
        this.likedCheck = true;
        this.disabled = false;
        this.toastr.success('Liked Successfully!');
      })
  }
  unlikePage() {
    let resp;
    this.disabled = true;
    
    this.pageService.unlikePage(this.id)
      .subscribe(data => {
        this.likedCheck = false;
        this.disabled = false;
        this.toastr.success('Unliked Successfully!');
      })
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

  submitPicData()
  {
    let pageTempData;
    if(this.profilePicCheck)
    {
      this.profileLoading = true;
      this.pageDataInput.img_id = this.media_id;
      console.log(this.pageDataInput);
      
    }
    else if(this.coverPicCheck)
    {
      this.loading = true;
      this.pageDataInput.cover_id = this.media_id;
      console.log(this.pageDataInput);
    }
    this.pageService.putPage(this.pageDataInput, this.pageDataInput.id)
    .subscribe(data => {
      pageTempData = data.json();
      this.loading = false;
      this.imageResponse = false;
      this.profileLoading = false;
      this.profileResponse = false;
    },
    error => {
      this.loading = false;
      this.imageResponse = false;
      this.profileLoading = false;
      this.profileResponse = false;
    });

  }

  routerLink(key) {
    switch (key) {
      case 'home':
        return this.router.navigate(["page/" + this.id]);

      case 'about':
        {
          return this.router.navigate(["page/" + this.id + "/about"]);
        }
      case 'friends':
        {
          return this.router.navigate(["page/" + this.id + "/friends"]);
        }
      case 'photos':
        {
          return this.router.navigate(["page/" + this.id + "/photos"]);
        }
      case 'posts':
        {
          return this.router.navigate(["page/" + this.id + "/posts"]);
        }
      case 'videos':
        {
          return this.router.navigate(["page/" + this.id + "/videos"]);
        }
    }
  }


}
