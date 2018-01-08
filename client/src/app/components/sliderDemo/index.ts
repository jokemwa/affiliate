import { Component } from '@angular/core';


@Component({
    selector: 'ImageShow',
    template: `
    <contentSlider [slides]="images"></contentSlider>
    `
})
export class ImageShowComponent{
   images:Array<any> = [{"sType":"img","imgSrc":"..."},{"sType":"div","content":"...Hello It's slidable content"}];
  constructor(){
  }
}