import {Http} from "@angular/http";
import { Sfremote } from "./sfremote";

export function SfremoteDataFactory (http: Http) {
    return () => {
        return new Sfremote(http);
    };
}

export let SfremoteDataFactoryProvider = {provide: Sfremote, useFactory: SfremoteDataFactory, deps: [Http]};