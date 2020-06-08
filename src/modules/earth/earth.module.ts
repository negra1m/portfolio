import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { AnimatedComponent } from './animated/animated.component';



@NgModule({
  declarations: [JumbotronComponent, AnimatedComponent],
  imports: [
    CommonModule
  ]
})
export class EarthModule { }
