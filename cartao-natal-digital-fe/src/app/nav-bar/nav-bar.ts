import { Component, HostListener } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  imports: [MatIconModule],
  standalone: true,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {

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
