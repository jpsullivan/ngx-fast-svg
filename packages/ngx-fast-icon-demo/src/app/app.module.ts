import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DescriptionComponent } from './routes/description/description.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { FastSvgModule } from '@push-based/ngx-fast-svg';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule.withServerTransition({ appId: 'ngx-fast-icon-demo' }),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    TransferHttpCacheModule,
    FastSvgModule.forRoot({
      url: (name: string) => `assets/svg-icons/${name}.svg`,
    }),
    IonicModule.forRoot(),
    RouterModule.forRoot(
      [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'description',
        },
        {
          path: 'ngx-fast-icon',
          loadChildren: () =>
            import('./misc/ngx-fast-svg/fast-svg-list.module').then(
              (m) => m.FastSvgListModule
            ),
        },
        {
          path: 'icon',
          loadChildren: () =>
            import('./misc/angular-svg-icon/angular-svg-icon-list.module').then(
              (m) => m.AngularSvgIconListModule
            ),
        },
        {
          path: 'description',
          component: DescriptionComponent,
        },
        {
          path: 'angular',
          loadChildren: () =>
            import('./comparison/angular/angular.module').then(
              (m) => m.AngularModule
            ),
        },
        {
          path: 'material',
          loadChildren: () =>
            import('./comparison/material/material.module').then(
              (m) => m.MaterialComponentModule
            ),
        },
        {
          path: 'ant',
          loadChildren: () =>
            import('./comparison/ant/ant.module').then((m) => m.AntModule),
        },
        {
          path: 'ionic',
          loadChildren: () =>
            import('./comparison/ionic/ionic.module').then(
              (m) => m.IonicComponentModule
            ),
        },
        {
          path: 'font-awesome',
          loadChildren: () =>
            import('./comparison/font-awesome/font-awesome.module').then(
              (m) => m.FontAwesomeRouteModule
            ),
        },
        {
          path: 'fast-svg',
          loadChildren: () =>
            import('./comparison/fast-icon/fast-icon.module').then(
              (m) => m.FastIconRouteModule
            ),
        },
        /* {
        path:'angular-material-icon',
        loadChildren: () => import('./angular-material-icons-list/angular-material-icons-list.module').then(m => m.AngularMaterialIconListModule)
      },*/
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
