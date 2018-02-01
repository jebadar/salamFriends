import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { UserServicesService } from '../user-services.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResetComponent } from '../reset/reset.component'
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  model: any = {};
  loading = false;
  returnUrl: string;
  reset = false;
  error = false;

  constructor(
    private userServicesService: UserServicesService,
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastsManager,
  ) { }

  ngOnInit() {
    this.userServicesService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$")
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{8,}$")
      ])
    });
  }

  login() {
    if (this.loginForm.get('email').status == 'VALID') {
      this.model.email = this.loginForm.get('email').value;
    } else {
      this.toastr.warning("Email is required, Use valid email address",null, { tapToDismiss: true ,closeButton:true,showDuration: 300, hideDuration: 1000,
      timeOut: 5000,
      extendedTimeOut: 1000,showCloseButton: true});
    }
    if (this.loginForm.get('password').status == 'VALID') {
      this.model.password = this.loginForm.get('password').value;
    } else {
      this.toastr.warning("Enter valid password, Min 8 charaters",null, { tapToDismiss: true, closeButton:true,showDuration: 300, hideDuration: 1000,timeOut: 5000,extendedTimeOut: 1000,showCloseButton: true});
    }
    if (this.loginForm.status == 'VALID') {
    this.loading = true;
    this.userServicesService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          // this.toastr.error("Error in login, Please try again!","Oops", { tapToDismiss: true, closeButton:true,showDuration: 300, hideDuration: 1000,
          //   timeOut: 5000,
          //   extendedTimeOut: 1000,showCloseButton: true});
        }
      )
    }
    
  }
  forgetPassword() {
    this.reset = true;
  }

  setFlag(value:boolean){
    this.reset = value;
  }
}
