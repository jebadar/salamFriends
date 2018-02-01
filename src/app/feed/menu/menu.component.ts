import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { UserServicesService } from '../../users/user-services.service';
import { DpComponent } from '../../shared/dp/dp.component'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ListComponent } from '../../page/list/list.component'

@Component({
  selector: 'menu-component',
  templateUrl: './menu.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class MenuComponent implements OnInit {
  asset_url = Constants.ASSET_URL;
  user:any = {};
  fullName:string;
  imgAddress:String;
  width = 40;
  constructor(private userServicesService:UserServicesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(this.userServicesService.getUserInfo())
    this.fullName = this.user.f_name +" "+ this.user.l_name;
    this.imgAddress = this.user.profile_pic;
  }

  navigate(value) {
    this.router.navigate([value]);
  }
}
