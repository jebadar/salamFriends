import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpServicesService } from '../app-services/http-services.service';
import { LocStoreService } from '../app-services/loc-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../constants';

const Assets_URL = Constants.ASSET_URL;
const Store_URL = Constants.STORAGE_URL;

@Injectable()
export class UserServicesService {
  returnUrl: string;
  loading = false;
  private accessTokken;
  private user: any = {};

  constructor(
    private httpServicesService: HttpServicesService,
    private locStoreService: LocStoreService,
    private toastr: ToastsManager
  ) {
    if (locStoreService.get('userTokken')) {
      this.accessTokken = locStoreService.get('userTokken');
      this.user = JSON.parse(locStoreService.get('userDetail'));
      this.httpServicesService.setTokken(this.accessTokken);
    }
  }

  // get userInfo(): Object {
  //   return this.user;
  // }
  // set userInfo(value: Object) {
  //   this.user = value;
  // }
  resetUser(){
    this.user = {};
  }
  isAuthenticated() {
    if (this.accessTokken != null) {
      return true;
    }
    else {
      return false;
    }
  }

  getLogedInUserId(){
    this.user = JSON.parse(this.locStoreService.get('userDetail'))
    return this.user.id;
  }
  login(email: string, password: string) {
    let showErrors = {
      e401: false
    }
    let observable = this.httpServicesService.post('login', JSON.stringify({ email: email, password: password }), showErrors)
      .map((response: Response) => {
        let user = response.json();
        user.userdetails[0] = this.populateProfileNCoverLinks(user.userdetails[0]);
        return user;
      });

    observable.subscribe(user => {
      if (user && user.access_token) {
        this.locStoreService.set('userTokken', user.access_token);
        this.httpServicesService.setTokken(user.access_token);
        this.locStoreService.set('userDetail', JSON.stringify(user.userdetails[0]));
        this.user = user.userdetails;
        this.accessTokken = user.access_token;
        this.toastr.success("Login Successfull.", null);
      }
    }, error => {
      if (error.status == 401) {
        this.toastr.error('Invalid email / password.', 'Oops!', { showCloseButton: true });
      }
    });

    return observable
  }

  register(user) {
    let showErrors = {
      e400: false,
      e404: false
    }
    let observable = this.httpServicesService.post('users/register', JSON.stringify({ user }), showErrors)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }

    },
      error => {
        if (error.status == 404 || error.status == 400) {
          let message = JSON.parse(error._body);
          this.toastr.error(message.message, 'Oops!');
        }
      })

    return observable;
  }
  verify(accessToken) {
    return this.httpServicesService.get('users/verification/', accessToken);
  }
  logout() {
    //remove user from local storage
    this.locStoreService.remove('userTokken');
    this.httpServicesService.setTokken('');
  }
  reset(email: string) {
    return this.httpServicesService.get('users/forget/', email)
  }
  newPassword(user) {
    return this.httpServicesService.post('users/reset', JSON.stringify({ user }));
  }
  private userDetail = JSON.parse(this.locStoreService.get('userDetail'))
  getMetadataInfo() {
    let observable = this.httpServicesService.get('info')

    observable.subscribe(data => {
      let metadata = data.json();
      this.locStoreService.set('userMetaInfo:'+this.getLogedInUserId(),JSON.stringify(metadata.info.details));
    }) 
    return observable;
  }
  getMetaDetail(id) {
    return new Observable(observer => {
      let info = this.locStoreService.get('userMetaInfo:'+id);
      if(info != "undefined"){
        let details = JSON.parse(this.locStoreService.get('userMetaInfo:'+id));
        observer.next(details);
      }
      this.httpServicesService.get('userdetails/'+ id)
      .subscribe(data => {
        let details = data.json();
        details = details.UserDetails
        if(details.length > 0)
          {
            this.locStoreService.set('userMetaInfo:'+id,JSON.stringify(details));
            observer.next(details);
            observer.complete();
          }
      })
    })
    //return this.httpServicesService.get('userdetails/', id);
  }
  getUser(id) {

    return new Observable(observer => {
        if (this.locStoreService.get('userData:'+id)) {
          let user = JSON.parse(this.locStoreService.get('userData:'+id));
          observer.next(user);  
        } 

        this.httpServicesService.get('users/', id)
        .subscribe(data => {
          let user = data.json()
          user = user.user;
          if(user.length>0){
            let data = user[0];
            data = this.populateProfileNCoverLinks(data);
            this.locStoreService.set('userData:'+id,JSON.stringify(data));
            observer.next(data);
            observer.complete();
          }
        });
        
    });
  }
  postText(post) {
    let showErrors = {
      e400: false
    }
    let observable = this.httpServicesService.post('post', JSON.stringify({ post }), showErrors)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        // this.toastr.success("Status Successfully Updated.", null);
      }
    })
    return observable;

  }
  getUserInfo() {
    return this.locStoreService.get('userDetail');
  }
  getTokken() {
    return this.locStoreService.get('userTokken');
  }
  postUserDetails(Userdetails) {
    let observable = this.httpServicesService.post('userdetails', JSON.stringify({ Userdetails }))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Updated Successfully.", null);
      }
    })
    return observable;
  }
  putUserDetails(Userdetails, id) {
    let observable = this.httpServicesService.put('userdetails/' + id, JSON.stringify({ Userdetails }))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Updated Successfully.", null);
      }
    })
    return observable;
  }
  putUser(user, id) {
    let observable = this.httpServicesService.put('users/' + id, JSON.stringify({ user }))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Updated Successfully.", null);
      }
    }, error => {})
    return observable.map(data => {
      let user = data.json()
      this.locStoreService.set('userDetail', JSON.stringify(user[0]));
      return user[0]
    });;
  }
  addFriend(friends) {
    let observable = this.httpServicesService.post('friends', JSON.stringify({ friends }))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Request Sended Sccessfully", null);
      }
    })
    return observable;
  }
  unFriend(friends, id) {
    let observable = this.httpServicesService.put('friends/' + id, JSON.stringify({ friends }))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Sccessfully Removed", null);
      }
    })
    return observable;
  }
  blockUser(userId) {
    let observable = this.httpServicesService.get('friends/block/block/' + userId)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Block Successfully.", null);
      }
    })
    return observable;
  }
  unblockUser(userId) {
    let observable = this.httpServicesService.get('friends/block/unblock/' + userId)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        this.toastr.success("Unblock Successfully.", null);
      }
    })
    return observable;
  }
  getFriends(){
    let observable = this.httpServicesService.get('friends')
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;
  }
  getFriendsById(id){
    let observable = this.httpServicesService.get('friends/'+id)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;
  }

  populateProfileNCoverLinks(data){
    data.profileImageLink = "";
    data.coverImageLink = "";

    if (data.cover_pic.length > 0 && data.cover_pic[0].picture.path) {
      data.coverImageLink = Store_URL + data.cover_pic[0].picture.path;
    }
    else {
      data.coverImageLink = Assets_URL + "images/profile-cover-image.png";
    }

    if (data.profile_pic.length > 0 && data.profile_pic[0].picture.path) {
      data.profileImageLink = Store_URL + data.profile_pic[0].picture.path;
    }
    else {
      data.profileImageLink = Assets_URL + "images/member-1.jpg";
    }

    return data;
  }
  getPages()
  {
    let observable = this.httpServicesService.get('page')
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;

  }
  getActvLog()
  {
    let id = this.getLogedInUserId()
    let observable = this.httpServicesService.get('log/'+id)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;
  }
  detectmob() {
    if(window.innerWidth <= 800 && window.innerHeight <= 800) {
      return false;
    } else {
      return true;
    }
 }
 getUserPhotos(id,limit,offset)
 {
   let res
   let tempStr = "?belongs_to=self&&type=picture&&limit="+limit+"&&offset="+offset;
   let observable = this.httpServicesService.get('posts/'+id,tempStr)
  // return observable;
  return observable.map(data => {
    let posts = data.json();
    let _album = [];
    for(let count = 0;count < posts.length;count++)
    {
      let path = posts[count].media[0].picture.path;
      posts[count].path = path;
      path = Store_URL + path;
      const album = {
        src: path,
        caption: posts[count].content
      };
      _album.push(album);
      //debugger;
    }
    posts.album = _album;
    return posts;
  });
 }
}
