import { Component, OnInit,Input } from '@angular/core';
import { UserServicesService } from '../../users/user-services.service'
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { LoaderComponent } from '../../shared/loader/loader.component'

@Component({
  selector: 'page-setting-component',
  templateUrl: './page-setting.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PageSettingComponent implements OnInit {
  @Input() pageDataInput;
  constructor(
    private userService: UserServicesService,
    private pageService:PageService
  ) {
    this.approve.push({value:"Yes"})
    this.approve.push({value:"No"})
    this.allowed.push({value:"Allowed"})
    this.allowed.push({value:"Not Allowed"})
   }
  detectmob:boolean;
  asset_url = Constants.ASSET_URL;
  margin = 121;
  settings:any = {};
  editClick = false;
  approve:Array<info> = [];
  allowed:Array<info> = [];
  settingsArr:any = {};
  loading = false;
  ngOnInit() {
    this.fetchSettings()
    this.detectmob = this.userService.detectmob();
  }
  fetchSettings()
  {
    this.pageService.getSettings(this.pageDataInput.id)
    .subscribe(data => {
      let temp = data.json();
      this.settings = temp[0];
      this.initSettingsArr(this.settings)
    })
  }
  edit()
  {
    this.editClick = true;
  }
  closeEdit()
  {
    this.editClick = false;
  }
  submit()
  {
    this.loading = true;
    this.initSettings(this.settingsArr)
    this.pageService.putSettings(this.pageDataInput.id,this.settings)
    .subscribe(data => {
      let res = data.json()
      console.log(res)
      this.editClick = false;
      this.loading = false;
    })
    console.log(this.settings)
  }
  initSettingsArr(settings)
  {
    if(settings.approval == '1')
    {
      this.settingsArr.approval = "Yes";
    }
    else if(settings.approval == '0')
    {
      this.settingsArr.approval = "No";
    }
    if(settings.comment == '1')
    {
      this.settingsArr.comment = "Allowed"
    }
    else if(settings.comment == '0')
    {
      this.settingsArr.comment = "Not Allowed"
    }
    if(settings.notification == '1')
    {
      this.settingsArr.notification = "Yes"
    }
    else if(settings.notification == '0')
    {
      this.settingsArr.notification = "No"
    }
    if(settings.post == '1')
    {
      this.settingsArr.post = "Allowed"
    }
    else if(settings.post == '0')
    {
      this.settingsArr.post = "Not Allowed"
    }
  }
  initSettings(settingsArr)
  {
    if(settingsArr.approval == "Yes")
    {
      this.settings.approval = '1';
    }
    else if(settingsArr.approval == "No")
    {
      this.settings.approval = '0';
    }
    if(settingsArr.comment == "Allowed")
    {
      this.settings.comment = '1'
    }
    else if(settingsArr.comment == "Not Allowed")
    {
      this.settingsArr.comment = '0'
    }
    if(settingsArr.notification == "Yes")
    {
      this.settings.notification = '1'
    }
    else if(settingsArr.notification == "No")
    {
      this.settings.notification = '0'
    }
    if(settingsArr.post == "Allowed")
    {
      this.settings.post = '1'
    }
    else if(settingsArr.post == "Not Allowed")
    {
      this.settings.post = '0'
    }
  }
}
interface info {
  value:string
}
