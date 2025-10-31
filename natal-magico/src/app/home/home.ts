import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { FlocosNeve } from "../flocos-neve/flocos-neve";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, FlocosNeve, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
