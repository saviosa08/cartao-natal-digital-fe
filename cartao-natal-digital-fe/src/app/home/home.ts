import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { FlocosNeve } from "../flocos-neve/flocos-neve";
import {MatIconModule} from '@angular/material/icon';
import { NavBar } from "../nav-bar/nav-bar";
import { Footer } from "../footer/footer";
import { routes } from '../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NavBar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

  constructor(
    private rotas: Router
  )
  {}

  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  navegarCriarCartao(){
    this.rotas.navigate(['criar-cartao']);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: any) {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

}
