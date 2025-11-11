import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { FlocosNeve } from "../flocos-neve/flocos-neve";
import {MatIconModule} from '@angular/material/icon';
import { NavBar } from "../nav-bar/nav-bar";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FlocosNeve, MatIconModule, NavBar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: any) {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

}
