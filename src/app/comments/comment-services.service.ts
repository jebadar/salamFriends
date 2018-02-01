import { Injectable } from '@angular/core';
import { HttpServicesService } from '../app-services/http-services.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class CommentServicesService {

  constructor(
    private httpServicesService: HttpServicesService,
    private toastr: ToastsManager
  ) { }

  postComment(comment) {
    let showErrors = {
      e400: false,
      e404: false
    }
    let observable = this.httpServicesService.post('comment', JSON.stringify({ comment }), showErrors)
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
  

  editComment(comment){
    return this.httpServicesService.put('comment/'+comment.comment.id,JSON.stringify({comment}))
  }

  deleteComment(comment){
    return this.httpServicesService.delete('comment/'+comment.id);
  }
}
