import { Component, OnInit, Inject, Injectable,ElementRef,ViewChild } from '@angular/core';
import {RequestOptions,Headers} from '@angular/http';
import { LogoutComponent } from '../../users/logout/logout.component';
import { ProfileComponent } from '../../users/profile/profile.component';
import { Constants } from '../../constants'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap';
import { RemoteData,CompleterData,CompleterItem } from 'ng2-completer';
import { CompleterService } from '../completer.service';
import{ UserServicesService } from '../../users/user-services.service'
import { DpComponent } from '../../shared/dp/dp.component'
import { BsDropdownModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-main',
  host: {
    '(document:click)': 'handleClick($event)',
  },
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [CompleterService]
})

export class MainComponent implements OnInit {
  @ViewChild('searchBarMob') elementRef: ElementRef;

  protected searchStr = "";
  protected captain: string;
  protected dataService: any;

  user:any = {};
  fullName = "";
  imgAddress = "";
  width = 30;
  topNavItem = 0;

  searchShow = false;
  detectmob:boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private completerService: CompleterService,
    private userServicesService:UserServicesService
     ) { }
  arrayToSend = JSON.stringify({
    search:this.searchStr
  })
  
  asset_url = Constants.ASSET_URL;
  public isCollapsed: boolean = true;
  accessTokken = this.userServicesService.getTokken();
  
  api_url = Constants.API_URL + 'users/search?search=';
  ngOnInit() {
    this.user = JSON.parse(this.userServicesService.getUserInfo())
    this.fullName = this.user.f_name +" "+ this.user.l_name;
    this.imgAddress = this.user.profile_pic;
    this.detectmob = this.userServicesService.detectmob();
    let headers = new Headers();
    
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.accessTokken );

    let options = new RequestOptions({ headers:headers, method:"get"});
    
    
    
    this.dataService = this.completerService.remote(this.api_url, null, "f_name,l_name");
    
    this.dataService.descriptionField("email");
    this.dataService.imageField("profile_pic.0.picture.path");
    this.dataService.requestOptions(options);
    
  }
  collapseMenu()
  {
    this.isCollapsed = !this.isCollapsed
    if(this.searchShow == true){
      this.searchShow = false;
    }
  }
  searchMobToggle(){
    if(!this.isCollapsed)
    {
      this.isCollapsed = true;
    }
    if(this.searchShow == true){
      this.searchShow = false;
    }
    else{
      this.searchShow = true;
    }
  }
  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
        if (clickedComponent === this.elementRef.nativeElement) {
            inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(inside){
      //if clicked inside navbar
    } else {
      if(this.searchShow == true){
        this.searchShow = false;
      }
      if(!this.isCollapsed)
      {
        this.isCollapsed = true;
      }
    }
  }
  navigate(value) {
    if(!this.isCollapsed){
      this.isCollapsed = true;
    }
     
    this.router.navigate([value]);
  }

  protected onSelected(item: CompleterItem) {
    this.searchMobToggle()
    if(item && item.originalObject && item.originalObject.id){
      let id = item.originalObject.id;
      this.router.navigate(["user/"+id]);
    }
    
  }
  selectNav(num) {
    this.topNavItem = num;
  }
}
