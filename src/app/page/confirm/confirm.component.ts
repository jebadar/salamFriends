import { Component, OnInit,NgModule } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { PageService } from '../page.service';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
export interface ConfirmModel {
  category:Array<string>;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  category: Array<string>;
  constructor(dialogService: DialogService,
    private pageService:PageService,
  private toastr:ToastsManager) {
    super(dialogService);
    this.pageCreate = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
      ]),
      category: new FormControl(null, [
        Validators.required
      ])
    });
  }
  pageCreate: FormGroup;
  page:any = {};
  createdCheck = false;
  response;
  loading = false;
  confirm() {
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code 
   
   
   if (this.pageCreate.get('title').status == 'VALID') {
    this.page.title = this.pageCreate.get('title').value;
  } else {
    this.toastr.warning("Name is required",null, { tapToDismiss: true ,closeButton:true,showDuration: 300, hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,showCloseButton: true});
  }
  if (this.pageCreate.get('category').status == 'VALID') {
    this.page.category = this.pageCreate.get('category').value;
  } else {
    this.toastr.warning("Category is required",null, { tapToDismiss: true, closeButton:true,showDuration: 300, hideDuration: 1000,timeOut: 5000,extendedTimeOut: 1000,showCloseButton: true});
  }
  if (this.pageCreate.status == 'VALID') {
    this.loading = true;
   this.pageService.createPage(this.page)
    .subscribe(data => {
    this.response = data.json();
    this.createdCheck =  true;
    this.loading = false;
    },
    error => {
      this.loading = false;
    })
  }
    // 
    // 
  }
  navigate()
  {
    this.result = this.response.id
    this.close();
  }
}
