import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  public arrayUnique(array) {
    const uniqueArray = array.filter((value, index) => {
      return index === array.findIndex(obj => {
        return JSON.stringify(obj) === JSON.stringify(value);
      });
    });
    return uniqueArray;
  }
}
