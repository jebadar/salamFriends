import { Component, OnInit, ElementRef, ViewChild, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { UserServicesService } from '../user-services.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../../constants'
import { DpComponent } from '../../shared/dp/dp.component'
import { StatusService } from '../../shared/status-service/status.service'
const URL = Constants.MEDIA_URL;
@Component({
  selector: 'post-photo-component',
  templateUrl: './post-photo.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})

export class PostPhotoComponent implements OnInit {
  @Output() postID: EventEmitter<number> = new EventEmitter<any>();
  @Input() pageId;
  @ViewChild('uploadButton') fileRef: ElementRef;
  public uploader: FileUploader;
  accessTokken: string;
  media_id: string;
  post_image = 0;
  post_description = false;
  post: any = {};
  post_id: number;
  uploadedImage: string;
  progress_bar: number = 0;
  asset_url = Constants.ASSET_URL;
  preview = false;
  imgPreview: string;
  privacy: Array<string> = ["Public", "Friends", "Only me"];
  selectedPrivacy = "Public"

  constructor(
    private userServicesService: UserServicesService,
    private toastr: ToastsManager,
    private changeDetector: ChangeDetectorRef,
    private statusService: StatusService
  ) {
    this.accessTokken = this.userServicesService.getTokken();
    this.initUploader();
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response);
    this.media_id = data.media_id;
    this.post_image = 2;
    this.preview = true;
    this.imgPreview = data.path;
    this.toastr.success('File uploaded. Click on Post');
  }

  ngOnInit() {
  }
  initUploader() {
    this.uploader = new FileUploader({ url: URL, allowedMimeType: ['image/png', 'image/jpeg'] });

    this.uploader.authToken = this.accessTokken;
    var uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value: 'Bearer ' + this.accessTokken }]
    this.uploader.setOptions(uo);
    this.uploader.onAfterAddingFile = (file) => {
      file.alias = "picture";
      this.fileRef.nativeElement.click();
      this.uploadedImage = file.file.name;
      this.post_image = 1;
    }
    this.uploader.onWhenAddingFileFailed = (file) => {
      this.toastr.error('Oops!, Only JPEG or PNG images allowed');
      this.post_image = 0;
      // this.uploader = new FileUploader({ url: URL, allowedMimeType: ['image/png', 'image/jpeg'] });
    }
    this.uploader.onProgressAll = (progress: any) => {
      this.changeDetector.detectChanges();
      this.progress_bar = progress;
    }
    this.uploader.onErrorItem = (file) => {
    }
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

  }
  cancel() {
    this.media_id = "";
    this.preview = false;
    this.imgPreview = "";
    this.uploadedImage = "";
    this.progress_bar = 0;
  }
  submitPost() {
    if (this.post_image === 2) {
      if (this.pageId != undefined) {
        this.post.belongs_to = "page";
        this.post.belong_id = this.pageId.toString();
      }
      else {
        this.post.belongs_to = "self";
        this.post.belong_id = this.userServicesService.getLogedInUserId();
      }
      this.post.privacy = "2";
      this.post.mediaId = this.media_id;
      this.post.status = "1";
      this.post.parent_id = "";
      this.post.tag = {};
      this.userServicesService.postText(this.post)
        .subscribe(data => {
          this.post_id = data.json().id;
          this.postID.emit(this.post_id);
          this.post.content = "";
          this.post_image = 0;
          this.post_description = false;
          this.uploadedImage = "";
          this.progress_bar = 0;
          this.preview = false;
          let status = data.json()
          this.statusService.setStatus(status)
        });
    }
    else if (this.post_image === 1) {
      this.toastr.error('Wait for file to upload');
    }
    else {
      this.toastr.error('Select a video file and enter description');
    }
  }

  progressBar() {
    return this.progress_bar;
  }




  hide = true;
  uploadFlag = false;
}
