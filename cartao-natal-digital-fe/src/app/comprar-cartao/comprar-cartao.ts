import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Uf } from '../interfaces/cidades';
import { CidadeServiceService } from '../services/cidadeService/cidade-service.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-comprar-cartao',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatIcon],
  templateUrl: './comprar-cartao.html',
  styleUrl: './comprar-cartao.scss',
})
export class ComprarCartao {

  constructor (
    private formBuilder: FormBuilder,
    private cidadeService: CidadeServiceService
  ) 
  { }

  formCompra!: FormGroup;
  ufs: Uf[] = [];

  ngOnInit() {

    this.formCompra = this.formBuilder.group({
      email: new FormControl('', [Validators.required]),
      uf: new FormControl ('')
    })
  }

  carregaUfs() {
    console.log('teste');
    this.cidadeService.getUfs().subscribe((data: Uf[]) => {
      this.ufs = data;
      console.log(this.ufs);
    });
  }

  ufChange() {
    console.log("Valor: ", this.formCompra.get('uf')?.value);
    this.formCompra.get('cidade')?.reset();

    if (this.formCompra.get('uf')?.value) {
      this.formCompra.get('cidade')?.enable();
    } else {
      this.formCompra.get('cidade')?.disable();
    }
  }

  confirmarCompra(){
    console.log("Teste");
  }

}
