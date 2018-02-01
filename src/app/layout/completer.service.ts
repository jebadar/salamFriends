import {Injectable, Inject} from "@angular/core";
import { Observable } from "rxjs/Observable";

import {Sfremote} from "./sfremote";


@Injectable()
export class CompleterService {
    constructor(
        @Inject(Sfremote) private SfremoteDataFactory: any // Using any instead of () => LocalData because on AoT errors
    ) { }

    public remote(url: string | null, searchFields: string | null = "", titleField: string | null = ""): Sfremote {

        let Sfremote = this.SfremoteDataFactory();
        return Sfremote
            .remoteUrl(url)
            .searchFields(searchFields)
            .titleField(titleField);
    }
}