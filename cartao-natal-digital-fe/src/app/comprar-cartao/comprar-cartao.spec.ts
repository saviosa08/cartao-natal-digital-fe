import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarCartao } from './comprar-cartao';

describe('ComprarCartao', () => {
  let component: ComprarCartao;
  let fixture: ComponentFixture<ComprarCartao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprarCartao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprarCartao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
