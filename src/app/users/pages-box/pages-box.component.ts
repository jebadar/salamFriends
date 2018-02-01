import { Component, OnInit,Input } from '@angular/core';
import { Constants } from '../../constants'
import { Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DpComponent } from '../../shared/dp/dp.component'
import { LoaderComponent } from '../../shared/loader/loader.component'
import { UserServicesService} from '../user-services.service'

@Component({
  selector: 'pages-box-component',
  templateUrl: './pages-box.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class PagesBoxComponent implements OnInit { 
  @Input() searchCheck;
  Assets_URL = Constants.ASSET_URL;
  loading = false;
  pageList: any = {};
  title: Array<listData> = [];
  imgAddress:string;
  constructor(
    private userService: UserServicesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.imgAddress = this.Assets_URL + "images/member-1.jpg";
    this.loading = true;
    this.fetchPageList();
    this.loading = false;
  }
  fetchPageList() {
    this.userService.getPages()
      .subscribe(data => {
        this.pageList = data.json();
        this.generateList(this.pageList);
      })
  }
  navigate(id) {
    let value = 'page/'+id;
    this.router.navigate([value]);
  }
  generateList(List) {
    let _list;
    if(List.page === undefined) {
      _list = List;
    } else {
      _list = List.page;
    }
    _list.forEach(item => {
      if (item.page_id != null || item.page_id != undefined) {
        if (this.title.find(x => x.title === item.pages.title)) {
          //if already exist do nothing
        }
        else {
          this.title.push({
            title:item.pages.title,
          id:item.page_id
        })}
      }
    });
  }
}
interface listData{
  id:number,
  title:string
}


