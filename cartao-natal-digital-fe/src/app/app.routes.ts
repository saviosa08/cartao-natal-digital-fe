import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CriarCartao } from './criar-cartao/criar-cartao';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'criar-cartao',
    component: CriarCartao
  }
];
