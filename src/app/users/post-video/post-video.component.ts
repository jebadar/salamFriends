import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { UserServicesService } from '../user-services.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {Constants} from '../../constants'
import { StatusService } from '../../shared/status-service/status.service';
const URL = Constants.MEDIA_URL;

@Component({
  selector: 'post-video-component',
  templateUrl: './post-video.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PostVideoComponent implements OnInit {
  @Output() postID: EventEmitter<number> = new EventEmitter<any>();
  @Input() pageId;
  @ViewChild('uploadButton') fileRef: ElementRef;
  public uploader: FileUploader;
  accessTokken: string;
  media_id: string;
  post_video: number = 0;
  post_description = false;
  post: any = {};
  post_id: number;
  uploadedVideo: string;
  progress_bar: number = 0;
  asset_url = Constants.ASSET_URL;
  preview = false;
  videoPreview = "";
  privacy:Array<string> = ["Public","Friends","Only me"];
  selectedPrivacy = "Public"

  constructor(
    private userServicesService: UserServicesService,
    private toastr: ToastsManager,
    private changeDetector: ChangeDetectorRef,
    private statusService: StatusService
  ) {
    this.accessTokken = this.userServicesService.getTokken();
    this.uploader = new FileUploader({ url: URL, allowedMimeType: ['video/mp4'] });

    this.uploader.authToken = this.accessTokken;
    var uo: FileUploaderOptions = {};
    uo.headers = [{ name: 'Authorization', value: 'Bearer ' + this.accessTokken }]
    this.uploader.setOptions(uo);
    this.uploader.onAfterAddingFile = (file) => {
      file.alias = "video";
      this.fileRef.nativeElement.click();
      this.uploadedVideo = file.file.name;
      this.post_video = 1;
    }
    this.uploader.onWhenAddingFileFailed = (file) => {
      this.toastr.error('Oops!, Only MP4 video files allowed');
      this.post_video = 0;
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
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    this.toastr.success('File uploaded. Click on Post');
    let data = JSON.parse(response);
    this.media_id = data.media_id;
    this.post_video = 2;
    this.videoPreview = data.path;
    this.preview = true;
  }

  ngOnInit() {
  }
  cancel()
  {
    this.media_id = "";
    this.preview = false;
    this.videoPreview = "";
    this.progress_bar=0;
    this.uploadedVideo = "";
  }
  submitPost() {
    if (this.post_video === 2) {
      if(this.pageId !=undefined)
      {
        this.post.belongs_to = "page";
        this.post.belong_id = this.pageId.toString();
      }
      else{
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
          this.post_video = 0;
          this.post_description = false;
          this.uploadedVideo = "";
          this.progress_bar = 0;
          this.preview = false;
          let status = data.json();
          this.statusService.setStatus(status)
        });
    }
    else if (this.post_video === 1) {
      this.toastr.error('Please wait while the video is uploading.');
    }
    else {
      this.toastr.error('Select a video file and enter description.');
    }
  }



  hide = true;
  uploadFlag = false;

}
