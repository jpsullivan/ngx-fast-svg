import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FastSvgListComponent } from './fast-svg-list.component';
import { FastIconModule } from '@ngx-fast-icon';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [FastSvgListComponent],
  imports: [
    CommonModule,
    FastIconModule.forRoot({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
    }),
    RouterModule.forChild([
      {
        path: '',
        component: FastSvgListComponent,
      },
    ]),
  ],
})
export class FastSvgListModule {}
