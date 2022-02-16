import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required],
    // frontera: [{value: '', disabled: true}, Validators.required],
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  // UI
  cargando:boolean = false;

  constructor(
    private fb:FormBuilder,
    private paisesService: PaisesService
  ) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // cuando cambie la region
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);

    //     this.paisesService.getPaisesPorRegion( region )
    //       .subscribe( paises => {
    //         console.log(paises);
    //         this.paises = paises;
    //       })
    //   } )

    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => { //
          // resetear formulario al cambiar de contiennte
          this.miFormulario.get('pais')?.reset('');
          // this.miFormulario.get('frontera')?.disable();
          this.cargando = true;
        } ),
        switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
      )
      .subscribe( paises => {
        // console.log(paises)
        this.paises = paises;
        this.cargando = false;

      })

    // cuando cambia el pais
    this.miFormulario.get("pais")?.valueChanges
      .pipe(
        tap( ( _ ) => { // ( _ )  significa que no importa lo que mande
          // resetear formulario al cambiar de pais
          // this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          // this.miFormulario.get('frontera')?.enable();
          this.cargando = true;
        } ),
        switchMap(codigo => this.paisesService.getPaisesByCodigo(codigo))
      )
      .subscribe(pais => {
        // console.log("pais", pais)
        if (pais.length > 0) {
          this.fronteras = pais[0].borders || [];
          this.cargando = false;
        }
      })


  }

  guardar() {
    console.log(this.miFormulario.value)
  }

}
