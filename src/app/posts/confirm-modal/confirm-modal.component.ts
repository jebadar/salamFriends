import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
export interface ConfirmModel {
  confirm:boolean;
}
@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel{

  confirm: boolean;
  constructor(dialogService: DialogService) {
    super(dialogService);
  }
  response;
  loading = false;
  confirmDelete() {
    this.result = true;
    this.close();
    // we set dialog result as true on click on confirm button, 
    // then we can get dialog result from caller code
  }
}
