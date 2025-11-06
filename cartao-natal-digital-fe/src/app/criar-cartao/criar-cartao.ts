import { CommonModule, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { CidadeServiceService } from '../services/cidadeService/cidade-service.service';
import { Cidade, Uf } from '../interfaces/cidades';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';


@Component({
  selector: 'app-criar-cartao',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatIcon, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatAutocompleteModule, CommonModule, AsyncPipe],
  templateUrl: './criar-cartao.html',
  styleUrl: './criar-cartao.scss',
})
export class CriarCartao {

  constructor(
      private formBuilder: FormBuilder,
      private cidadeService: CidadeServiceService
    ) {}

  formCartao!: FormGroup;

  ufs: Uf[] = [];

  cidades: Cidade[] = [];
  cidadesFiltradas!: Observable<Cidade[]>
  cidadeForm = new FormControl();
  cidadeSelecionada!: string;



  ngOnInit() {

    this.formCartao = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      uf: new FormControl('', [Validators.required]),
      cidade: new FormControl({ value: this.cidadeForm, disabled: true }, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      remetente: new FormControl('', [Validators.required]),
      mensagem: new FormControl('', [Validators.required]),
    });

    this.carregaUfs();

    this.cidadeForm.valueChanges.subscribe( vlr => {
        this.cidadeSelecionada && vlr != this.cidadeSelecionada ?
        this.formCartao.get('cidade')?.setValue('') :
        false
    });

    // this.filtraCidades();
    // this.cidadesFiltradas = this.formCartao.get('cidade')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterCidade(value || ''))
    // );
  }

  // filter(): void {
  //   const filterValue = this.formCartao.get('cidade')?.value;
  //   console.log("Valor: ", filterValue);
  //   this.cidadesFiltradas = this.cidades.filter(o => o.nome.toLowerCase().includes(filterValue));
  // }

  filtraCidades(){
    this.cidadesFiltradas = this.cidadeForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCidade(value || ''))
    );
  }

  limpaCidade(){
    console.log("Cidade limpa!");
  }

   private _filterCidade(value: string){
    const filterValue = value.toLowerCase();

    console.log('chamou filtro:');

    return this.cidades.filter(cidade => cidade.nome.toLowerCase().includes(filterValue));
  }


  carregaUfs(){
    console.log('teste');
    this.cidadeService.getUfs().subscribe((data: Uf[]) => {
        this.ufs = data;
        console.log(this.ufs);
      });
  }

  ufChange(){
    console.log("Valor: ",this.formCartao.get('uf')?.value);
    this.formCartao.get('cidade')?.reset();
    this.cidadeForm.reset();
    
    if(this.formCartao.get('uf')?.value){
      this.formCartao.get('cidade')?.enable();
    } else {
      this.formCartao.get('cidade')?.disable();
    }
      this.carregaCidades();
  }

  carregaCidades(){
    this.cidadeService.getCidades(this.formCartao.get('uf')?.value).subscribe((data: Cidade[]) => {
        console.log(data);
        this.cidades = data;
        this.filtraCidades();
      });
  }

  onCidadeSelecionada(event: MatAutocompleteSelectedEvent){
    this.cidadeSelecionada = event.option.value;
    this.formCartao.get('cidade')?.setValue(this.cidadeSelecionada);
  }

  onSubmit() {
    if (!this.formCartao.valid) {
      console.log(this.formCartao.value);

    } else {
      console.log('Formulário inválido');
    }
  }

  value: string = 'Testeaa';
  selectedCar: string ='';
  selectedValue: string ='';

  cars: Car[] = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'},
  ];
}

interface Car {
  value: string;
  viewValue: string;
}
