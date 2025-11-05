import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Uf } from '../../interfaces/cidades';

@Injectable({
  providedIn: 'root'
})
export class CidadeServiceService {

  urlUF: string = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

  urlCidades: string = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios';

  constructor(private http: HttpClient) {}

  getUfs() {
    return this.http.get(this.urlUF).pipe(
      map((data: any) => {
        return data.map((uf: Uf) => {
          return {
            id: uf.id,
            sigla: uf.sigla,
            nome: uf.nome
          };
        }).sort((a: Uf, b: Uf) => a.nome > b.nome ? 1 : -1);
      })
    );
  }

  getCidades(ufId: number) {
    const url = this.urlCidades.replace('{UF}', ufId.toString());
    return this.http.get(url).pipe(
      map((data: any) => {
        return data.map((cidade: any) => {
          return {
            id: cidade.id,
            nome: cidade.nome
          };
        }).sort((a: any, b: any) => a.nome > b.nome ? 1 : -1);
      })
    );
  }
}
