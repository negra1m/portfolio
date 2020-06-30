import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'portfolio';
  background: any;
  mousemove$: any;
  constructor() { }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e) {
    console.log(e);
  }
}
