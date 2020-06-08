import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RingComponent } from './ring/ring.component';
import { TvComponent } from './tv/tv.component';
import { PanelComponent } from './panel/panel.component';



@NgModule({
  declarations: [RingComponent, TvComponent, PanelComponent],
  imports: [
    CommonModule
  ]
})
export class HedgehogModule { }
