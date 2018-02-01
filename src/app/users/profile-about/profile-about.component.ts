import { Component, OnInit, Input } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { Constants } from '../../constants'
import { SettingsComponent } from '../settings/settings.component'

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class ProfileAboutComponent implements OnInit {

  constructor(
    private userServicesService: UserServicesService
  ) { }
  infoArray: Array<info> = [];
  metadata: any = {};
  metadataInfo: any = {};
  metadataInfo_res:any = {};
  selectedItem:Array<string> = [];
  detectmob:boolean;
  loading = false;
  details: any = [];
  editClick = false;
  emptyCheck = false;
  emptyCheck_res = false;
  disableBtn = false;
  box_res = false;
  textBtn: string;
  textBtn_res:string;
  basicTitle: Array<subinfo> = [];
  tempDate:Array<Date> = [];
  selectedGender;
  basicInfo: info = {
    id: "basic",
    status: " ",
    title: "Basic Info",
    update_at: " ",
    subinfo: this.basicTitle
  }
  user: any = {};
  userBasicArr: Array<subinfo> = [];
  basic: Array<subinfo> = [];
  Userdetails: Array<detail> = [];
  gender: Array<subinfo> = [];
  asset_url = Constants.ASSET_URL;
  ngOnInit() {
    this.detectmob = this.userServicesService.detectmob();
    this.user = JSON.parse(this.userServicesService.getUserInfo());
    this.pushUser(this.user); //push user array for input fields for edit
    this.initInfoArr();
    this.fetchMetaInfo(); // metadat from API then initialize for edit
  }
  initInfoArr()
  {
    this.gender.push({ title: "male" });
    this.gender.push({ title: "female" }) //set gender for drop down and model
    this.basicTitle.push({ title: "First Name" });
    this.basicTitle.push({ title: "Last Name" });
    this.basicTitle.push({ title: "Email" });
    this.basicTitle.push({ title: "Date of birth" });
    this.basicTitle.push({ title: "Gender" }); 
    this.infoArray.splice(0, 0, this.basicInfo);//set head of Info Array to Basic Info -> index 0
    
  }
  fetchMetaInfo()
  {
    this.loading = true;
    this.userServicesService.getMetadataInfo()
    .subscribe(data => {
      this.metadata = data.json();
      this.pushMetaToInfo(this.metadata)
      this.initDetail(this.metadata.info.details)
      this.loading = false;
    })
  }
  pushMetaToInfo(metadata)
  {
    if (metadata.info.metadata == undefined) {
      this.infoArray.push(metadata.info[0])
    }
    else {
      this.infoArray.push(metadata.info.metadata[0]);
    }
  }
  initDetail(details)
  {
    this.selectedItem[0] = this.infoArray[0].title;
    if(!this.detectmob)
      {
        this.selectedItem[1] = this.infoArray[1].title;
        this.metadataInfo_res = this.infoArray[1];
      }
    this.metadataInfo = this.infoArray[0];
    this.textBtn = "Edit";
    if (details != undefined) {
      if (details.length > 0) {
        this.details = details;
        this.textBtn_res = "Edit"
      }
      else
      {
        this.textBtn_res = "Add"
        this.emptyCheck_res = true;
      }
    }
  }
  subInfo(id, counter) {
    this.editClick = false;
    this.disableBtn = false;
    if (this.infoArray[counter].id == id) { //for mobile view
      this.selectedItem[0] = this.infoArray[counter].title;
      this.metadataInfo = this.infoArray[counter];
    }
    if (id != "basic") {
      if (this.metadata.info.details != null || this.metadata.info.details != undefined) {
        if (this.metadata.info.details.length != 0) {
          this.emptyCheck = false;
          this.textBtn = "Edit";
        }
        else {
          this.emptyCheck = true;
          this.textBtn = "Add";
        }
      }
    }
    else {
      this.emptyCheck = false;
      this.textBtn = "Edit";
    }
  }
  submitDetail() {
    this.loading = true;
    let item = "";
    if(!this.detectmob && this.box_res)
    {
      item = this.selectedItem[1]
    }
    else
    {
      item = this.selectedItem[0]
    }
    if (item != "Basic Info") {
      if (!this.checkDetail()) {
         //= new Date(this.details[2].description)
        this.Userdetails[2].description =  this.tempDate[0].toString()
        this.Userdetails[3].description = this.tempDate[1].toString();
        this.userServicesService.postUserDetails(this.Userdetails)
          .subscribe(data => {
            this.metadata.info.details = data.json();
            this.details = this.metadata.info.details;
            this.emptyCheck = false;
            this.textBtn = "Edit";
            this.closeItemBox();
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
      }
      else {
        this.Userdetails[2].description = this.tempDate[0].toString(); // double dates for to from -> education
        this.Userdetails[3].description = this.tempDate[1].toString();
        this.userServicesService.putUserDetails(this.Userdetails, this.user.id)
          .subscribe(data => {
            this.details = data.json();
            this.closeItemBox();
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
      }
    }
    else {
      this.user = JSON.parse(this.userServicesService.getUserInfo());
      this.user.f_name = this.Userdetails[0].description;
      this.user.l_name = this.Userdetails[1].description;
      this.user.email = this.Userdetails[2].description;
      this.user.date_of_birth = this.tempDate[0].toString();
      this.user.gender = this.selectedGender;
      this.userServicesService.putUser(this.user, this.user.id)
        .subscribe(data => {
          this.user = data;
          this.updateUser(this.user);
          this.closeItemBox();
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
    }
  }
  editItem(item) {
    this.editClick = true;
    this.disableBtn = true;
    this.Userdetails = [];
    let length = 0;
    if(!this.detectmob)
    {
      if(item != "Basic Info")
      {
        this.box_res = true;
      }
      else
      {
        this.box_res = false;
      }
      length = this.metadataInfo_res.subinfo.length
    }
    else{
      length = this.metadataInfo.subinfo.length;
    }
    if (this.checkDetail()) {
      for (let counter = 0; counter < length; counter++) {
        if (item != "Basic Info") {
          if (this.metadata.info.details != undefined) {
            if (this.metadata.info.details.length > 0) {
              this.Userdetails.push({
                id: this.details[counter].id,
                user_id: this.user.id,
                info_id: this.metadataInfo.subinfo[counter].id,
                description: this.details[counter].description,
                privacy: "public"
              })
              this.tempDate[0] = new Date(this.details[2].description)
              this.tempDate[1] = new Date(this.details[3].description) 
            }
          }
        }
        else {
          this.Userdetails.push({
            id: 0,
            user_id: this.user.id,
            info_id: this.metadataInfo.subinfo[counter].id,
            description: this.userBasicArr[counter].title,
            privacy: "public"
          })
        }
      }
    }
    else {
        this.pushUserDetailArr(this.box_res);
    }
  }
  pushUserDetailArr(responsiveCheck)
  {
    if(!responsiveCheck){
      this.metadataInfo.subinfo.forEach(item => {
        this.Userdetails.push({
          id: 0,
          user_id: this.user.id,
          info_id: item.id,
          privacy: "public",
          description: ""
        })
      })
    }
    else{
      this.metadataInfo_res.subinfo.forEach(item => {
      this.Userdetails.push({
        id: 0,
        user_id: this.user.id,
        info_id: item.id,
        privacy: "public",
        description: ""
      })
    })
    }
  }
  checkDetail()
  {
    if(this.emptyCheck)
      {
        return false;
      }
      else if(this.emptyCheck_res)
        {
          return false;
        }
        else 
          return true;
  }
  closeItemBox() {
    this.editClick = false;
    this.disableBtn = false;
    this.box_res = false;
  }
  pushUser(userArr) {
    this.userBasicArr.push({ title: userArr.f_name });
    this.userBasicArr.push({ title: userArr.l_name });
    this.userBasicArr.push({ title: userArr.email });
    this.userBasicArr.push({ title: userArr.date_of_birth });
    this.tempDate[0] = new Date(userArr.date_of_birth);
    this.selectedGender = userArr.gender;
    this.userBasicArr.push({ title: userArr.gender });
  }
  updateUser(userArr) {
    this.userBasicArr[0].title = userArr.f_name;
    this.userBasicArr[1].title = userArr.l_name;
    this.userBasicArr[2].title = userArr.email;
    this.userBasicArr[3].title = userArr.date_of_birth;
    this.userBasicArr[4].title = userArr.gender;
  }
}
interface info {
  id: string,
  status: string,
  title: string,
  update_at: string,
  subinfo: Array<subinfo>
}
interface detail {
  id: number
  user_id: number
  info_id: string,
  description: String,
  privacy: string
}
interface subinfo {
  title: string,
}