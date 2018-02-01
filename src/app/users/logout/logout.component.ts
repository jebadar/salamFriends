import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { UserServicesService} from '../user-services.service'

@Component({
  selector: 'logout-component',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  returnUrl:string;
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private userServicesService:UserServicesService) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/welcome';
  
  }
  logout()
  {
    //remove user from local storage
    this.userServicesService.logout();
    this.userServicesService.resetUser();
    this.router.navigate([this.returnUrl]);
  }
}
