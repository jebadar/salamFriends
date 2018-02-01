import { Component, OnInit } from '@angular/core';
import { PageMainComponent } from '../page-main/page-main.component'
import { PageService } from '../page.service'
import { Router,ActivatedRoute, Params } from '@angular/router';
import { UserServicesService } from '../../users/user-services.service'
import { PageSettingComponent } from '../page-setting/page-setting.component'
import { CollapseDirective } from 'ngx-bootstrap';

@Component({
  selector: 'page-wrapper-component',
  templateUrl: './page-wrapper.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PageWrapperComponent implements OnInit {

  constructor(
    private pageService:PageService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private userService: UserServicesService
  ) { }

  adminCheck = false;
  pageData:any = {};
  id: number;
  userId = this.userService.getLogedInUserId();
  likedCheck = false;
  settingCheck = false;
  margin = 1;
  public isCollapsed: boolean = true;
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.id) {
        this.id = params.id;
        this.fetchPageData(this.id)
      }
    });
  }
  collapseMenu() {
    this.isCollapsed = !this.isCollapsed
  }
  checkAdmin(pageData,userid)
  {
    if(pageData.admins[0].user_id == userid)
    {
      this.adminCheck = true;
      this.margin = 33
    }
    else
    {
      this.adminCheck = false;
      this.margin = 1;
    }
  }
  fetchPageData(id)
  {
    this.pageService.getPagebyId(id)
    .subscribe(data => {
      this.pageData = data.json();
      console.log(this.pageData);
      this.checkAdmin(this.pageData,this.userId)
      this.likedCheck = this.likeArrCheck(this.pageData.likes)
    })
  }
  settingShow()
  {
    if(!this.isCollapsed)
    {
      this.isCollapsed = !this.isCollapsed;
    }
    this.settingCheck = true;
  }
  navigate(value) {
    if(this.settingCheck)
    {
        this.settingCheck = false;
    }
    //this.router.navigate([value]);
  }
  likeArrCheck(likes) {
    if (likes != undefined) {
      if (likes.find(x => x.user_id == this.userService.getLogedInUserId() && x.status == 1)) {
        return true;
      }
      else {
        return false;
      }
    }
  }

}
