import { Component, OnInit } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { Constants } from '../../constants'
import { Router} from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component'

@Component({
  selector: 'activity-log-component',
  templateUrl: './activity-log.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class ActivityLogComponent implements OnInit {
  Assets_URL = Constants.ASSET_URL;
  logArray:Array<logObj> = [];
  loading = false;
  user:any = {};
  fullName:string;
  dateDisplay:string;
  dateCompare:string;
  constructor(
    private userService:UserServicesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetchLog();
    this.fetchUser()
  }

  fetchLog()
  {
    this.loading = true;
    this.userService.getActvLog()
    .subscribe(data => {
      this.logArray = data.json();
      this.dateCompare = this.logArray[0].created_at;
      this.dateDisplay = this.setDate(this.dateCompare);
      this.loading = false;
    })
  }
  fetchUser()
  {
    this.user = JSON.parse(this.userService.getUserInfo());
    this.fullName = this.user.f_name +' '+ this.user.l_name;
  }
  navigate(value) {
     this.router.navigate([value]);
  }
  dateStepup(counter)
  {
    let tempDate;
    this.dateCompare = this.logArray[counter].created_at;
    tempDate = this.setDate(this.dateCompare);
    if(tempDate == this.dateDisplay)
    {
      return false;
    }
    else{
      this.dateDisplay = tempDate
      return true;
    }
  }
  setDate(date)
  {
    let dateTemp = new Date(date).toUTCString();
    dateTemp= dateTemp.split(' ').slice(0, 4).join(' ')
    return dateTemp;
  }

}
interface logObj{
  created_at:string,
  description:string
  id:number
  type:string
  updated_at:string
  user_id:number
}