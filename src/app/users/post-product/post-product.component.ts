import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FileUploader, FileItem, ParsedResponseHeaders, FileUploaderOptions } from 'ng2-file-upload';
import { UserServicesService } from '../user-services.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../../constants'
import { StatusService } from '../../shared/status-service/status.service'
const URL = Constants.MEDIA_URL;

@Component({
  selector: 'post-product-component',
  templateUrl: './post-product.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PostProductComponent implements OnInit {
  @Output() postID: EventEmitter<number> = new EventEmitter<any>();
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

  constructor(
    private userServicesService: UserServicesService,
    private toastr: ToastsManager,
    private changeDetector: ChangeDetectorRef,
    private statusService: StatusService
  ) {
    this.accessTokken = this.userServicesService.getTokken();
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
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response);
    this.media_id = data.media_id;
    this.post_image = 2;
    this.toastr.success('File uploaded. Click on Post');
  }

  ngOnInit() {
  }
  submitPost() {
    if (this.post_image === 2) {
      this.post.belongs_to = "self";
      this.post.privacy = "2";
      this.post.mediaId = this.media_id;
      this.post.status = "1";
      this.post.parent_id = "";
      this.post.tag = {};
      console.log(this.post);
      this.userServicesService.postText(this.post)
        .subscribe(data => {
          this.post_id = data.json().id;
          this.postID.emit(this.post_id);
          this.post.content = "";
          this.post_image = 0;
          this.post_description = false;
          this.uploadedImage = "";
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



  hide = true;
  uploadFlag = false;
}
