import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlocosNeve } from './flocos-neve';

describe('FlocosNeve', () => {
  let component: FlocosNeve;
  let fixture: ComponentFixture<FlocosNeve>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlocosNeve]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlocosNeve);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
