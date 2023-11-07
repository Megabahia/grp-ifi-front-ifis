import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CoreSidebarService} from '@core/components/core-sidebar/core-sidebar.service';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {MisFacturasService} from './mis-facturas.service';

/**
 * IFIS
 * Personas
 * Esta pantalla sirve para mostrar las facturas
 * Rutas:
 * `${environment.apiUrl}/central/param/listar/tipo/`,
 * `${environment.apiUrl}/central/param/list/tipo/todos/`,
 * `${environment.apiUrl}/central/param/list/filtro/nombre`,
 * `${environment.apiUrl}/central/param/list/listOne`,
 * `${environment.apiUrl}/corp/empresas/listOne/filtros/`,
 * `${environment.apiUrl}/core/monedas/create/`
 * `${environment.apiUrl}/central/facturas/list/`,
 */

@Component({
  selector: 'app-mis-facturas',
  templateUrl: './mis-facturas.component.html',
  styleUrls: ['./mis-facturas.component.scss'],
  providers: [DatePipe]
})
export class MisFacturasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NgbPagination) paginator: NgbPagination;
  public page = 1;
  public page_size: any = 10;
  public maxSize;
  public collectionSize;
  public facturas;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _misFacturasService: MisFacturasService,
    private datePipe: DatePipe,
    private _coreSidebarService: CoreSidebarService,
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.iniciarPaginador();

    this.obtenerListaFacturas();
  }

  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  obtenerListaFacturas() {
    this._misFacturasService.obtenerFacturas({
      page: this.page - 1, page_size: this.page_size
    }).subscribe(info => {
      this.facturas = info.info;
      this.collectionSize = info.cont;
    });
  }

  transformarFecha(fecha) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

  iniciarPaginador() {
    this.paginator.pageChange.subscribe(() => {
      this.obtenerListaFacturas();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
