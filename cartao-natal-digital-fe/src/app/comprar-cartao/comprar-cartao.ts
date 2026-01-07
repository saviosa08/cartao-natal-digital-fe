import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-comprar-cartao',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './comprar-cartao.html',
  styleUrl: './comprar-cartao.scss',
})
export class ComprarCartao {

}
