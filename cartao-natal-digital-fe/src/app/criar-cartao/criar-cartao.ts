import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CidadeServiceService } from '../services/cidadeService/cidade-service.service';
import { Cidade, Uf } from '../interfaces/cidades';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { EfeitoCartao, ModeloCartao } from '../interfaces/opcoesCartao';
import { HttpClient } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FlocosNeve } from "../flocos-neve/flocos-neve";
import { NavBar } from "../nav-bar/nav-bar";
import { Footer } from "../footer/footer";
import { ComprarCartao } from '../comprar-cartao/comprar-cartao';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-criar-cartao',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatIcon, MatButtonModule, MatSelectModule, ReactiveFormsModule, MatAutocompleteModule, CommonModule, MatGridListModule, MatCardModule, MatButtonToggleModule, FlocosNeve, NavBar, Footer],
  templateUrl: './criar-cartao.html',
  styleUrl: './criar-cartao.scss',
})
export class CriarCartao implements AfterViewInit {

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeServiceService,
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  formCartao!: FormGroup;

  ufs: Uf[] = [];

  cidades: Cidade[] = [];
  cidadesFiltradas!: Observable<Cidade[]>;
  cidadeForm = new FormControl();
  cidadeSelecionada!: string;
  modelosCartao: ModeloCartao[] = [];
  opcoesEfeito: EfeitoCartao[] = [];
  cartaoSelecionado!: ModeloCartao;
  opcaoSelecionada!: EfeitoCartao;
  mostraPreview = false;

  @ViewChild('carousel', { static: false }) carousel!: ElementRef<HTMLDivElement>;

  // state for disabling nav buttons when at the ends
  isAtStart = true;
  isAtEnd = false;

  // Scroll the carousel container left or right. direction: -1 (prev) or 1 (next)
  scrollCarousel(direction: number) {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    const scrollAmount = Math.round(el.clientWidth * 0.8);

    // compute clamped target to avoid blank space beyond the first/last item
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const target = Math.max(0, Math.min(el.scrollLeft + direction * scrollAmount, maxScrollLeft));

    // if we're already at the edge and target equals current, do nothing
    if (target === el.scrollLeft) return;

    el.scrollTo({ left: target, behavior: 'smooth' });

    // update state after a short delay (smooth scroll will trigger scroll events too)
    setTimeout(() => this.updateCarouselState(), 250);
  }

  onCarouselScroll() {
    // called from template (scroll event)
    this.updateCarouselState();
  }

  private updateCarouselState() {
    if (!this.carousel) return;
    const el = this.carousel.nativeElement;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const left = el.scrollLeft;
    // consider a small epsilon to handle sub-pixel values
    const eps = 2;
    this.isAtStart = left <= eps;
    this.isAtEnd = left >= max - eps;
  }

  ngOnInit() {

    this.formCartao = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      uf: new FormControl(''),
      cidade: new FormControl({ value: this.cidadeForm, disabled: true }, [Validators.required]),
      email: new FormControl(''),
      destinatario: new FormControl('', [Validators.required]),
      mensagem: new FormControl('', [Validators.required]),
      modeloSelecionado: new FormControl('', [Validators.required]),
      efeitoSelecionado: new FormControl([0, Validators.required]),
    });

    // this.formCartao = this.formBuilder.group({
    //   nome: 'Joao',
    //   uf: 'ES',
    //   cidade: 'Cariacica',
    //   email: 'saa@b.com.br',
    //   destinatario: 'Maria',
    //   mensagem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    //   modeloSelecionado: '1',
    //   efeitoSelecionado: '1'
    // })
    this.carregaUfs();

    this.cidadeForm.valueChanges.subscribe(vlr => {
      this.cidadeSelecionada && vlr != this.cidadeSelecionada ?
        this.formCartao.get('cidade')?.setValue('') :
        false;
    });

    this.http.get<ModeloCartao[]>('assets/data/modelos-cartao.json').subscribe(r => {
      this.modelosCartao = r;
      console.log(this.modelosCartao);
      // update carousel state after modelos are rendered
      setTimeout(() => this.updateCarouselState(), 100);
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

  ngAfterViewInit(): void {
    // scroll to element with id 'inicio' when entering the page
    // small timeout ensures DOM and any route fragments have settled
    setTimeout(() => {
      try {
        const el = document.getElementById('inicio');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (e) {
        // safe-noop if document not available
        console.warn('Could not scroll to #inicio', e);
      }
    }, 60);
  }

  // filter(): void {
  //   const filterValue = this.formCartao.get('cidade')?.value;
  //   console.log("Valor: ", filterValue);
  //   this.cidadesFiltradas = this.cidades.filter(o => o.nome.toLowerCase().includes(filterValue));
  // }
  selecionarModelo(id: number) {
    console.log("Modelo selecionado: ", id);
    this.formCartao.get('modeloSelecionado')?.setValue(id);
    this.cartaoSelecionado = this.modelosCartao.find(m => m.id === this.formCartao.get('modeloSelecionado')?.value)!;
  }

  selecionarEfeito(id: number) {
    this.formCartao.get('efeitoSelecionado')?.setValue(id);
    this.opcaoSelecionada = this.opcoesEfeito.find(e => e.id === this.formCartao.get('efeitoSelecionado')?.value)!;
    console.log("Efeito selecionado", this.formCartao.get('efeitoSelecionado')?.value);
  }

  verificaPreview() {
    if (this.formCartao.get('modeloSelecionado')?.value &&
      this.formCartao.get('nome')?.value &&
      this.formCartao.get('destinatario')?.value &&
      this.formCartao.get('mensagem')?.value &&
      this.formCartao.get('efeitoSelecionado')?.value >= 0) {
      return true;
    } else {
      return false;
    }

  }

  filtraCidades() {
    this.cidadesFiltradas = this.cidadeForm.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCidade(value || ''))
    );
  }

  limpaCidade() {
    console.log("Cidade limpa!");
  }

  private _filterCidade(value: string) {
    const filterValue = value.toLowerCase();

    console.log('chamou filtro:');

    return this.cidades.filter(cidade => cidade.nome.toLowerCase().includes(filterValue));
  }


  carregaUfs() {
    console.log('teste');
    this.cidadeService.getUfs().subscribe((data: Uf[]) => {
      this.ufs = data;
      console.log(this.ufs);
    });
  }

  ufChange() {
    console.log("Valor: ", this.formCartao.get('uf')?.value);
    this.formCartao.get('cidade')?.reset();
    this.cidadeForm.reset();

    if (this.formCartao.get('uf')?.value) {
      this.formCartao.get('cidade')?.enable();
    } else {
      this.formCartao.get('cidade')?.disable();
    }
    this.carregaCidades();
  }

  carregaCidades() {
    this.cidadeService.getCidades(this.formCartao.get('uf')?.value).subscribe((data: Cidade[]) => {
      console.log(data);
      this.cidades = data;
      this.filtraCidades();
    });
  }

  onCidadeSelecionada(event: MatAutocompleteSelectedEvent) {
    this.cidadeSelecionada = event.option.value;
    this.formCartao.get('cidade')?.setValue(this.cidadeSelecionada);
  }

  onSubmit() {
    console.log("Formulário: ", this.formCartao.value)
    if (this.formCartao.valid) {
      const dialogRef = this.dialog.open(ComprarCartao, {
        width: '500px',
        disableClose: true, // impede fechar clicando fora
        data: {
          form: this.formCartao.value
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog fechado:', result);
      });
  
    } else {
      console.log('Formulário inválido');
    }
  }

  value: string = 'Testeaa';
  selectedCar: string = '';
  selectedValue: string = '';

  // cars: Car[] = [
  //   { value: 'volvo', viewValue: 'Volvo' },
  //   { value: 'saab', viewValue: 'Saab' },
  //   { value: 'mercedes', viewValue: 'Mercedes' },
  // ];
}
