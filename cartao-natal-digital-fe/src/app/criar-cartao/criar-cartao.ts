import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { CidadeServiceService } from '../services/cidadeService/cidade-service.service';
import { Cidade, Uf } from '../interfaces/cidades';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { EfeitoCartao, ModeloCartao } from '../interfaces/opcoesCartao';
import { HttpClient } from '@angular/common/http';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FlocosNeve } from "../flocos-neve/flocos-neve";


@Component({
  selector: 'app-criar-cartao',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatIcon, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatAutocompleteModule, CommonModule, AsyncPipe, MatGridListModule, MatCardModule, MatButtonToggleModule, FlocosNeve],
  templateUrl: './criar-cartao.html',
  styleUrl: './criar-cartao.scss',
})
export class CriarCartao {

  constructor(
      private formBuilder: FormBuilder,
      private cidadeService: CidadeServiceService,
      private http: HttpClient
    ) {}

  formCartao!: FormGroup;

  ufs: Uf[] = [];

  cidades: Cidade[] = [];
  cidadesFiltradas!: Observable<Cidade[]>
  cidadeForm = new FormControl();
  cidadeSelecionada!: string;
  modelosCartao: ModeloCartao[] = [];
  opcoesEfeito: EfeitoCartao[] = [];
  cartaoSelecionado!: ModeloCartao;
  opcaoSelecionada!: EfeitoCartao;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  // Scroll the carousel container left or right. direction: -1 (prev) or 1 (next)
  scrollCarousel(direction: number) {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    const scrollAmount = Math.round(el.clientWidth * 0.8);
    el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  }

  ngOnInit() {

    this.formCartao = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      uf: new FormControl('', [Validators.required]),
      cidade: new FormControl({ value: this.cidadeForm, disabled: true }, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      destinatario: new FormControl('', [Validators.required]),
      mensagem: new FormControl('', [Validators.required]),
      modeloSelecionado: new FormControl('', [Validators.required]),
      efeitoSelecionado: new FormControl(0, [Validators.required]),
    });

    this.carregaUfs();

    this.cidadeForm.valueChanges.subscribe( vlr => {
        this.cidadeSelecionada && vlr != this.cidadeSelecionada ?
        this.formCartao.get('cidade')?.setValue('') :
        false
    });

    this.http.get<ModeloCartao[]>('assets/data/modelos-cartao.json').subscribe(r => {
      this.modelosCartao = r;
      console.log(this.modelosCartao);
    });
    this.http.get<EfeitoCartao[]>('assets/data/efeito.json').subscribe(r => {
      this.opcoesEfeito = r;
      console.log(this.opcoesEfeito);
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

  selecionarModelo(id:number){
    console.log("Modelo selecionado: ", id);
    this.formCartao.get('modeloSelecionado')?.setValue(id);
    this.cartaoSelecionado = this.modelosCartao.find(m => m.id === this.formCartao.get('modeloSelecionado')?.value)!;
  }

  selecionarEfeito(id: number){
    console.log("Efeito selecionado");
    this.formCartao.get('efeitoSelecionado')?.setValue(id);
    this.opcaoSelecionada = this.opcoesEfeito.find(e => e.id === this.formCartao.get('efeitoSelecionado')?.value)!;
  }

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
