import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpServicesService } from '../app-services/http-services.service';
import { LocStoreService } from '../app-services/loc-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Constants } from '../constants';

@Injectable()
export class PageService {
  returnUrl: string;
  loading = false;
  private accessTokken;
  private _userInfo: Array<string> = [];
  Store_URL = Constants.STORAGE_URL;

  constructor(
    private httpServicesService: HttpServicesService,
    private locStoreService: LocStoreService,
    private toastr: ToastsManager
  ) { 
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
  getPagebyId(id)
  {
    let observable = this.httpServicesService.get('page/',id)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        let page = data.json()
        this.locStoreService.set('page-'+id,JSON.stringify({page}))
      }
    })
    return observable;
  }
  likePage(pagelike)
  {
    let observable = this.httpServicesService.post('pagelikes',JSON.stringify({pagelike}))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
        
      }
    })
    return observable;
  }
  unlikePage(pageId){
    let observable = this.httpServicesService.delete('pagelikes/',pageId)
    return observable;
  }
  getCategory()
  {
    let observable = this.httpServicesService.get('category')
    return observable;
  }
  detectmob() {
    if(window.innerWidth <= 800 && window.innerHeight <= 800) {
      return false;
    } else {
      return true;
    }
 }
 createPage(page)
 {
  let observable = this.httpServicesService.post('page',JSON.stringify({page}))
  observable.subscribe(data => {
    if (data.json().errors) {
      this.toastr.error(data.json().errors[0].detail, 'Oops!');
    }
    else {
      
    }
  })
  return observable;
 }

 putSettings(id,settings)
 {
  let observable = this.httpServicesService.put('pagesettings/' + id, JSON.stringify({ settings }))
  observable.subscribe(data => {
    if (data.json().errors) {
      this.toastr.error(data.json().errors[0].detail, 'Oops!');
    }
    else {
      this.toastr.success("Updated Successfully.", null);
    }
  })
  return observable
 }
 putPage(page,id)
 {
  let observable = this.httpServicesService.put('page/' + id, JSON.stringify({ page }))
  observable.subscribe(data => {
    if (data.json().errors) {
      this.toastr.error(data.json().errors[0].detail, 'Oops!');
    }
    else {
      this.toastr.success("Updated Successfully.", null);
    }
  })
  return observable
 }
 getSettings(pageId)
 {
  let observable = this.httpServicesService.get('pagesettings/'+pageId)
  return observable;
 }
 getLoggedUser()
 {
  return this.locStoreService.get('userDetail');
 }
 getPageVideos(id,limit,offset)
 {
  let res
  let tempStr = "?belongs_to=page&&type=video&&limit="+limit+"&&offset="+offset;
  let observable = this.httpServicesService.get('posts/'+id,tempStr)
 // return observable;
 return observable.map(data => {
  let posts = data.json();
  for(let count = 0;count < posts.length;count++)
  {
    let path = posts[count].media[0].video.path;
    posts[count].path = path;
  }
  return posts;
});
 }
 getPagePhotos(id,limit,offset)
 {
   let res
   let tempStr = "?belongs_to=page&&type=picture&&limit="+limit+"&&offset="+offset;
   let observable = this.httpServicesService.get('posts/'+id,tempStr)
  // return observable;
  return observable.map(data => {
    let posts = data.json();
    let _album = [];
    for(let count = 0;count < posts.length;count++)
    {
      let path = posts[count].media[0].picture.path;
      posts[count].path = path;
      path = this.Store_URL + path;
      const album = {
        src: path,
        caption: posts[count].content
      };
      _album.push(album);
    }
    posts.album = _album;
    return posts;
  });
 }
}
