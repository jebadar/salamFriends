import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServicesService } from '../user-services.service'
import { LoaderComponent } from '../../../app/shared/loader/loader.component';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, Validators, FormControl } from "@angular/forms";
@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: any = {};
  loading = false;
  response = false;
  months: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  days: Array<string> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
  years: Array<string> = ['1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967',
    '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1978', '1979',
    '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990',
    '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003',
    '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
  returnUrl: string;
  month = "";
  day = "";
  year = "";
  agreementFlag = false;
  data: Array<string>;
  error: Array<string>;
  resError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userServicesService: UserServicesService,
    public toastr: ToastsManager
  ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
    this.registerForm = new FormGroup({
      first_name: new FormControl(null, [
        Validators.required
      ]),
      last_name: new FormControl(null, [
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$")
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern("^.{8,}$")
      ]),
      gender: new FormControl(null, [
        Validators.required
      ]),
      day: new FormControl(null, [
        Validators.required
      ]),
      month: new FormControl(null, [
        Validators.required
      ]),
      year: new FormControl(null, [
        Validators.required
      ]),
      agreement: new FormControl(null, [
        Validators.required
      ])
      
    });
  }
  buttonState() {
    return !this.agreementFlag.valueOf;
  }
  showError() {
    this.toastr.error('This is not good!', 'Oops!', { toastLife: 100000 });
  }
  register() {
    //
    if (this.registerForm.get('first_name').status == 'VALID') {
      this.user.f_name = this.registerForm.get('first_name').value;
    } else {
      this.toastr.warning("First Name is required Use 1-30 letters to spell Name",null,{showCloseButton: true});
    }
    if (this.registerForm.get('last_name').status == 'VALID') {
      this.user.l_name = this.registerForm.get('last_name').value;
    } else {
      this.toastr.warning("Last Name is required Use 1-30 letters to spell Name",null,{showCloseButton: true});
    }
    if (this.registerForm.get('email').status == 'VALID') {
      this.user.email = this.registerForm.get('email').value;
    } else {
      this.toastr.warning("Email is required, Use valid email address",null,{showCloseButton: true});
    }
    if (this.registerForm.get('password').status == 'VALID') {
      this.user.password = this.registerForm.get('password').value;
    } else {
      this.toastr.warning("Enter valid password, Min 8 charaters",null,{showCloseButton: true});
    }
    if (this.registerForm.get('gender').status == 'VALID') {
      this.user.gender = this.registerForm.get('gender').value;
    } else {
      this.toastr.warning("Please select gender",null,{showCloseButton: true});
    }
    if (this.registerForm.get('day').status == 'VALID') {
      this.day = this.registerForm.get('day').value;
    } else {
      this.toastr.warning("Please select day",null,{showCloseButton: true});
    }
    if (this.registerForm.get('month').status == 'VALID') {
      this.month = this.registerForm.get('month').value;
    } else {
      this.toastr.warning("Please select month",null,{showCloseButton: true});
    }
    if (this.registerForm.get('year').status == 'VALID') {
      this.year = this.registerForm.get('year').value;
    } else {
      this.toastr.warning("Please select year",null,{showCloseButton: true});
    }
    if (this.registerForm.get('agreement').status == 'VALID') {
      
    } else {
      this.toastr.warning("You are not agree to terms & conditions",null,{showCloseButton: true});
    }
    if (this.registerForm.status == 'VALID') {
      this.loading = true;
      this.user.date_of_birth = this.day + '-' + this.month + '-' + this.year;
      this.userServicesService.register(this.user)
      .subscribe(data => {
        this.loading = false;
        this.response = true;
        this.resError = false;
      }, // Reach here if res.status >= 200 && <= 299
      err => {
        this.resError = true;
        this.response = true;
        this.loading = false;
      });
    } 
   
    
  }

}
