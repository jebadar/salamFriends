import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpServicesService } from '../app-services/http-services.service';
import { LocStoreService } from '../app-services/loc-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class PostServicesService {
  returnUrl: string;
  loading = false;
  private accessTokken;
  private _userInfo: Array<string> = [];

  constructor(
    private httpServicesService: HttpServicesService,
    private locStoreService: LocStoreService,
    private toastr: ToastsManager
  ) {
    if (locStoreService.get('userTokken')) {
      this.accessTokken = locStoreService.get('userTokken');
      this._userInfo.push(JSON.parse(locStoreService.get('userDetail')));
      this.httpServicesService.setTokken(this.accessTokken);
    }
  }
  private userDetail = JSON.parse(this.locStoreService.get('userDetail'));

  // getUserPosts(limit,offset) {
  //   let tempStr = "?type=posts&&limit="+limit+"&&offset="+offset;
  //   return this.httpServicesService.get('posts/', this.userDetail.id);
  // }
  getUserPostsById(id,limit,offset,target,pagePostsTab) {

    let tempStr = "?belongs_to="+target+"&&limit="+limit+"&&offset="+offset;
    if(target == 'self')
    {
    return this.httpServicesService.get('posts/'+id,tempStr )
    .map( data => {
      data = data.json()
      return data;
    });    
    }
    else if(target == 'page')
    {
      return this.httpServicesService.get('posts/'+id,tempStr )
      .map(data => {
        let posts = data.json()
        let admin =JSON.parse(this.locStoreService.get('page-'+id)).page.admins[0]
        for(let count = 0;count < posts.length;count++)
        {
          if(pagePostsTab)
          {
            if(posts[count].user_id == admin.user_id)
            {
              posts.splice(count,1)
              count--
            }
          }
          else{
           if(posts[count].user_id == admin.user_id)
            {}
            else
            {
              posts.splice(count,1)
              count--
            }
          }
        }
        return posts;
      })      
    }
  }
  getPost(post) {
    return this.httpServicesService.get('post/' + post.id)
      .map(data => {
        let post = data.json()
        return post.post[0]
      });;
  }
  likePost(like) {
    let showErrors = {
      e400: false,
      e404: false
    }
    let observable = this.httpServicesService.post('likes', JSON.stringify({ like }), showErrors)
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
  unlikePost(post) {
    return this.httpServicesService.delete('likes/', post);
  }
  getPagebyId(id)
  {
    let observable = this.httpServicesService.get('page/',id)
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;
  }

  editPost(post)
  {
    let observable = this.httpServicesService.put('post/'+post.id,JSON.stringify({post}))
    observable.subscribe(data => {
      if (data.json().errors) {
        this.toastr.error(data.json().errors[0].detail, 'Oops!');
      }
      else {
      }
    })
    return observable;
  }
  deletePost(postId)
  {
    return this.httpServicesService.delete('post/', postId);
  }
}
