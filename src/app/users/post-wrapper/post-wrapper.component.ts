import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { PostTextComponent } from '../post-text/post-text.component';
import { PostPhotoComponent } from '../post-photo/post-photo.component';
import { PostAudioComponent } from '../post-audio/post-audio.component';
import { PostVideoComponent } from '../post-video/post-video.component';
import { PostProductComponent } from '../post-product/post-product.component';
import { Constants } from  '../../constants' 
import { LoaderComponent } from  '../../shared/loader/loader.component'
import {UserServicesService} from '../user-services.service'

@Component({
  selector: 'post-wrapper-component',
  templateUrl: './post-wrapper.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PostWrapperComponent implements OnInit {
  @Output() post_ID: EventEmitter<number> = new EventEmitter<any>();

  @Input() pageId;

  constructor(protected userServicesService:UserServicesService) { }

  ngOnInit() {
    this.detectmob = this.userServicesService.detectmob();
  }
  textCheck = true;
  photoCheck = false;
  audioCheck = false;
  videoCheck = false;
  productCheck = false;
  loading = false;
  asset_url = Constants.ASSET_URL;
  detectmob:boolean;

  enablePost(post) {
    this.textCheck = false;
    this.photoCheck = false;
    this.audioCheck = false;
    this.videoCheck = false;
    this.productCheck = false;

    switch(post){
      case 'text':
        this.textCheck = true;
        break;
      case 'photo':
        this.photoCheck = true;
        break;
      case 'audio':
        this.audioCheck = true;
        break;
      case 'video':
        this.videoCheck = true;
        break;
      case 'product':
        this.productCheck = true;
        break;
    }
  }

  textEnable() {
    this.enablePost("text");
  }
  photoEnable() {
    this.enablePost("photo");
  }
  audioEnable() {
    this.enablePost("audio");
  }
  videoEnable() {
    this.enablePost("video");
  }
  productEnable() {
    // this.enablePost("product");
  }
  setflag(event) {
    this.loading = event; // will output "chicken"
  }
  postID(event){
    this.post_ID.emit(event);
  }

}
