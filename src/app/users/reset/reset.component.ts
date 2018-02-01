import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderComponent } from '../../shared/loader/loader.component'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'reset-component',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  @Output() cancelCheck: EventEmitter<any> = new EventEmitter<any>();

  resetForm: FormGroup;
  newPasswordForm: FormGroup;
  model: any = {};
  loading = false;
  returnUrl: string;
  sendedMail = false;
  error = false;
  response = false;
  accessToken: string;
  resetFlag = false;
  errorReset = false;
  accessTokkenFlag = false;
  data: string;
  password = "";
  confirmPassword = "";
  flagSend = false; //Flag to be sended to login component to cancel
  matchPassword = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userServicesService: UserServicesService,
    private router: Router,
    public toastr: ToastsManager) { }

  ngOnInit() {
    let TokenCheck = false;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.accessTokken) {
        this.accessToken = params.accessTokken;
        this.resetFlag = true;
        TokenCheck = true;
      }
    });
    if (TokenCheck) {
      if (this.accessToken != ":") {
        this.loading = true;
        this.userServicesService.verify(this.accessToken)
          .map(res => {
            // If request fails, throw an Error that will be caught
            if (res.status < 200 || res.status >= 300) {
              this.loading = false;
              this.accessTokkenFlag = true;
              throw new Error('This request has failed ' + res.status);
            }
            // If everything went fine, return the response
            else {
              this.loading = false;

              return res.json();
            }
          })
          .subscribe(data => {
            this.loading = false;

            this.data = data;
          },
          err => {
            this.loading = false;
            this.accessTokkenFlag = true;
            this.response = true;
          })
      }
    }
    this.resetForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$")
      ])
    });
    this.newPasswordForm = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{8,}$")
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{8,}$")
      ])
    });
  }

  reset() {
    if (this.resetForm.get('email').status == 'VALID') {
      this.model.email = this.resetForm.get('email').value;
    } else {
      this.toastr.warning("Email is required, Enter valid email address", null, {
        tapToDismiss: true, closeButton: true, showDuration: 300, hideDuration: 1000,
        timeOut: 5000,
        extendedTimeOut: 1000, showCloseButton: true
      });
    }
    if (this.resetForm.status == 'VALID') {
      this.loading = true;
      this.userServicesService.reset(this.model.email)
        .subscribe(
        data => {
          this.sendedMail = true;
          this.toastr.success("Email sended successfully!", null);
          this.loading = false;
          this.model = {};
        },
        error => {
          this.error = true;
          this.toastr.error('Error in sending Email, Please try again!', 'Oops!', { toastLife: 100000 });
          this.loading = false;
        }
        )
    }
  }
  setPassword() {
    if (this.newPasswordForm.get('password').status == 'VALID') {
      this.password = this.newPasswordForm.get('password').value;
    } else {
      this.toastr.warning("Enter valid password, Min 8 charaters", null, { showCloseButton: true });
    }
    if (this.newPasswordForm.get('confirmPassword').status == 'VALID') {
      this.confirmPassword = this.newPasswordForm.get('confirmPassword').value;
    } else {
      this.toastr.warning("Enter valid password, Min 8 charaters", null, { showCloseButton: true });
    }
    if (this.newPasswordForm.status == 'VALID') {
      if (this.password == this.confirmPassword) {
        this.loading = true;
        this.model.token = this.accessToken;
        this.model.password = this.password;
        this.userServicesService.newPassword(this.model)
          .map(res => {
            // If request fails, throw an Error that will be caught
            if (res.status < 200 || res.status >= 300) {
              this.loading = false;
              this.errorReset = true;
              this.response = true;
            }
            // If everything went fine, return the response
            else {
              this.loading = false;
              this.response = true;
              return res.json();
            }
          })
          .subscribe(data => {
            this.loading = false;
            this.response = true;
            this.data = data;
          })
      }
      else {
        this.toastr.error('Passwords not matched, Please try again!', 'Oops!', { toastLife: 100000, showCloseButton: true });
      }
    }
  }
  cancel() {
    this.flagSend = false;
    this.cancelCheck.emit(this.flagSend);
  }

}
