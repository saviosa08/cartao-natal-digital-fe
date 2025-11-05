import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCartao } from './criar-cartao';

describe('CriarCartao', () => {
  let component: CriarCartao;
  let fixture: ComponentFixture<CriarCartao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarCartao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarCartao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
