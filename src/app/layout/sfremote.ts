import { Http } from "@angular/http";
import { RemoteData } from "ng2-completer";
import { Constants } from '../constants';

export class Sfremote extends RemoteData{

  constructor(private httpobj: Http) {
    super(httpobj);
   }

   public convertToItem(data: any): any | null {
      let item = super.convertToItem(data);
      
      try {
        item.image = Constants.STORAGE_URL+item.originalObject.profile_pic[0].picture.path;  
      } catch (error) {
        if(item != undefined){
          item.image = Constants.ASSET_URL + "images/member-1.jpg";
        }
      }
      
      return item;
  }
}
