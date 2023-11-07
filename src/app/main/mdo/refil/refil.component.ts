import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {DatePipe} from '@angular/common';
import {RefilService} from './refil.service';
import {ParamService} from 'app/services/param/param.service';
import {ExportService} from 'app/services/export/export.service';

/**
 * IFIS
 * ifis
 * Esta pantalla sirve para mostrar los refiles de los productos
 * Rutas:
 * `${apiUrl}/mdo/prediccionRefil/list/`,
 * `${apiUrl}/mdo/prediccionRefil/prediccionRefil/${id}`
 */

@Component({
  selector: 'app-refil',
  templateUrl: './refil.component.html',
  providers: [DatePipe],
})
export class RefilComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbPagination) paginator: NgbPagination;

  menu;
  page = 1;
  pageSize: any = 10;
  maxSize;
  collectionSize;
  identificacion;
  fecha = '';
  inicio = '';
  fin = '';
  prediccion;
  cliente;
  tipoCliente = '';
  tipoClienteModal = '';
  listaPredicciones;

  constructor(
    private refilService: RefilService,
    private datePipe: DatePipe,
    private globalParam: ParamService,
    private exportFile: ExportService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.menu = {
      modulo: 'mdo',
      seccion: 'predRefil',
    };
  }

  async ngAfterViewInit() {
    this.iniciarPaginador();
    this.obtenerListaPredicciones();
  }

  obtenerListaPredicciones() {
    const fecha = this.fecha.split(' to ');
    this.inicio = fecha[0] ? fecha[0] : '';
    this.fin = fecha[1] ? fecha[1] : '';
    if (this.inicio !== '' && this.fin === '') {
      this.fin = this.inicio;
    }
    let busqueda: any = {
      page: this.page - 1,
      page_size: this.pageSize,
      inicio: this.inicio,
      fin: this.fin,
    };
    if (this.tipoCliente === 'negocio') {
      busqueda = {
        ...busqueda,
        negocio: 1,
        identificacion: this.identificacion,
      };
    } else if (this.tipoCliente === 'cliente') {
      busqueda = {
        ...busqueda,
        cliente: 1,
        identificacion: this.identificacion,
      };
    }
    this.refilService.obtenerListaPredicciones(busqueda).subscribe((info) => {
      this.listaPredicciones = info.info;
      this.collectionSize = info.cont;
    });
  }

  async iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaPredicciones();
    });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

  abrirModal(modal) {
    /* this.ofertaId = id; */
    this.modalService.open(modal);
  }
}
