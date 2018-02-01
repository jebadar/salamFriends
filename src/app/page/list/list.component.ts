import { Component, OnInit} from '@angular/core';
import { Constants } from '../../constants';
import { PageService } from '../page.service'
import { Router } from '@angular/router';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";

@Component({
  selector: 'list-component',
  templateUrl: './list.component.html',
  styleUrls: ['../../layout/main/main.component.css']
})
export class ListComponent implements OnInit {
  constructor(
    private pageService: PageService,
    private router: Router,
    private dialogService:DialogService
  ) { }
  asset_url = Constants.ASSET_URL;
  pageList: any = {};
  title: Array<listData> = [];;
  loading = false;
  category:Array<string> = [];
  ngOnInit() {
    this.fetchPageList();
    this.fetchCategories();
    }
  fetchPageList() {
    this.loading = true;
    this.pageService.getPages()
      .subscribe(data => {
        this.pageList = data.json();
        this.generateList(this.pageList);
        this.loading = false;
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
  fetchCategories()
  {
    this.pageService.getCategory()
    .subscribe(data => {
      let x  = data.json()
      this.category = x.category;
    })
  }
  showConfirm() {
    let disposable = this.dialogService.addDialog(ConfirmComponent, {
        category:this.category })
        .subscribe((page_id)=>{
            //We get dialog result
            if(page_id != undefined) {
             this.router.navigate(['page/'+page_id]);
            }
            else {
            }
        });
    //We can close dialog calling disposable.unsubscribe();
    //If dialog was not closed manually close it by timeout
    // setTimeout(()=>{
    //     disposable.unsubscribe();
    // },10000);
}
}
interface listData{
  id:number,
  title:string
}
