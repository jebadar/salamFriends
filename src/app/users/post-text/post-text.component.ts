import { Component, OnInit, EventEmitter, Output,Input } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { StatusService } from '../../shared/status-service/status.service'

@Component({
  selector: 'post-text-component',
  templateUrl: './post-text.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PostTextComponent implements OnInit {

  constructor(
    private userServicesService: UserServicesService,
    private statusService: StatusService
  ) { }

  @Output() loadingCheck: EventEmitter<any> = new EventEmitter<any>();
  @Output() postID: EventEmitter<number> = new EventEmitter<any>();
  @Input() pageId;

  ngOnInit() {
  }
  post: any = {};
  loading = false;
  post_id: number;
  privacy:Array<string> = ["Public","Friends","Only me"];
  selectedPrivacy = "Public"
  submitPost() {
    this.loading = true;
    this.loadingCheck.emit(this.loading)
    if(this.pageId != undefined)
    {
      this.post.belongs_to = "page";
      this.post.belong_id =Number(this.pageId) 
    }
    else{
      this.post.belongs_to = "self";
      this.post.belong_id = this.userServicesService.getLogedInUserId();
    }
    this.post.privacy = "2";
    this.post.mediaId = 0;
    this.post.status = "1";
    this.post.parent_id = "";
    this.post.tag = {};
    this.userServicesService.postText(this.post)
      .subscribe(data => {
        let status  = data.json();
        this.loading = false;
        this.loadingCheck.emit(false)
        this.post = {};
        this.post_id = data.json().id;
        this.postID.emit(this.post_id);
        this.statusService.setStatus(status)
      });
  }
  

}
