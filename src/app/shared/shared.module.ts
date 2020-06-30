import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sharedComponents as SharedComponents } from './components';



@NgModule({
  declarations: [SharedComponents],
  imports: [
    CommonModule
  ],
  exports: [SharedComponents],

})
export class SharedModule { }
