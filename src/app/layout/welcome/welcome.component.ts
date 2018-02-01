import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../users/login/login.component'
import { RegisterComponent } from '../../users/register/register.component';
import {Constants} from '../../constants'
import { CollapseDirective } from 'ngx-bootstrap'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }
  asset_url = Constants.ASSET_URL;
  public isCollapsed: boolean = true;
  ngOnInit() {
  }

}
