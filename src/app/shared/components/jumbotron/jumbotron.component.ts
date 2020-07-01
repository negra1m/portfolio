import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.scss']
})
export class JumbotronComponent implements OnInit {
  isWeb: boolean;

  constructor() { }

  ngOnInit(): void {
    this.isWeb = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.checkScreen(event);
  }

  checkScreen(event) {
    if (window.innerWidth >= 750) {
      this.isWeb = true;
    } else {
      this.isWeb = false;
    }
  }

}
