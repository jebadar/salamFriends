import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServicesService } from '../user-services.service';
import { LoaderComponent } from '../../../app/shared/loader/loader.component'


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private userServicesService: UserServicesService,
    private route: ActivatedRoute,
    private router: Router) {

  }
  response = false;
  returnUrl = "";
  error = false;
  data: string;
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'register';
    let accessToken: string;
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params.accessTokken) {
        accessToken = params.accessTokken;
      }
    });
    if (accessToken != ":") {
      //accessToken = accessToken.substring(1);
      this.verify(accessToken)
    }
    else {
      this.router.navigate(['/']);
    }
  }
  verify(accessToken) {
    this.userServicesService.verify(accessToken)
      .map(res => {
        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
          this.error = true;
          this.response = false;
          throw new Error('This request has failed ' + res.status);
        }
        // If everything went fine, return the response
        else {
          this.response = true;
          return res.json();
        }
      })
      .subscribe(data => {
        this.response = true;
        this.data = data;
      },
      err => {
        this.error = true;
        this.response = false;
      })
  }

}
