import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { formatarMoeda as formatarMoedaUtil } from '../../utils/moeda.util';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonGrid, IonRow, IonCol, IonSearchbar, IonSegment, IonSegmentButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  statsChartOutline, cubeOutline, peopleOutline, cartOutline, cashOutline,
  searchOutline, alertCircleOutline, checkmarkCircleOutline, closeCircleOutline,
  walletOutline, barcodeOutline, mailOutline, phonePortraitOutline, calendarOutline,
  receiptOutline, cardOutline, timeOutline, checkmarkDoneOutline
} from 'ionicons/icons';
import { ProdutoService } from '../../services/produto.service';
import { ClienteService } from '../../services/cliente.service';
import { VendaService } from '../../services/venda.service';
import { FinanceiroService } from '../../services/financeiro.service';
import { Produto } from '../../models/produto.model';
import { Cliente } from '../../models/cliente.model';
import { Venda } from '../../models/venda.model';
import { Recebimento } from '../../models/recebimento.model';

interface RecebimentoExibicao extends Recebimento {
  cliente_nome?: string;
  data_venda?: string;
  itens_count?: number;
}

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonGrid, IonRow, IonCol, IonSearchbar, IonSegment, IonSegmentButton
  ]
})
export class RelatoriosPage implements OnInit {

  // Filtros ativos
  filtroTipo: string = 'todos'; // todos, resumo, produtos, clientes, vendas, recebimentos
  filtroStatusVenda: string = 'todas'; // todas, pendentes, pagas
  filtroStatusRecebimento: string = 'todos'; // todos, pendentes, pagos
  buscaTermo: string = '';

  // Listas de dados brutas
  produtos: Produto[] = [];
  clientes: Cliente[] = [];
  vendas: Venda[] = [];
  recebimentos: RecebimentoExibicao[] = [];

  // Resumo Geral estatístico
  totalProdutos: number = 0;
  totalClientes: number = 0;
  totalVendasCount: number = 0;
  vendasPendentesCount: number = 0;
  vendasPagasCount: number = 0;
  valorTotalVendido: number = 0;
  valorTotalPendente: number = 0;
  valorTotalRecebido: number = 0;

  // Estados
  carregando: boolean = false;

  constructor(
    private produtoService: ProdutoService,
    private clienteService: ClienteService,
    private vendaService: VendaService,
    private financeiroService: FinanceiroService
  ) {
    addIcons({
      statsChartOutline, cubeOutline, peopleOutline, cartOutline, cashOutline,
      searchOutline, alertCircleOutline, checkmarkCircleOutline, closeCircleOutline,
      walletOutline, barcodeOutline, mailOutline, phonePortraitOutline, calendarOutline,
      receiptOutline, cardOutline, timeOutline, checkmarkDoneOutline
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  /**
   * Ciclo de vida do Ionic para recarregar os dados sempre que a página for acessada.
   */
  async ionViewWillEnter() {
    await this.carregarDados();
  }

  /**
   * Carrega os dados de todos os serviços e processa as estatísticas de resumo geral.
   */
  async carregarDados() {
    this.carregando = true;
    try {
      // 1. Carrega Produtos
      this.produtos = await this.produtoService.listar();
      this.totalProdutos = this.produtos.length;

      // 2. Carrega Clientes
      this.clientes = await this.clienteService.listar();
      this.totalClientes = this.clientes.length;

      // 3. Carrega Vendas
      this.vendas = await this.vendaService.listarVendas();
      this.totalVendasCount = this.vendas.length;
      this.vendasPendentesCount = this.vendas.filter(v => v.status === 'pendente').length;
      this.vendasPagasCount = this.vendas.filter(v => v.status === 'paga').length;
      this.valorTotalVendido = this.vendas.reduce((sum, v) => sum + v.total, 0);

      // 4. Carrega Recebimentos
      const recsBrutos = await this.financeiroService.listarRecebimentos();
      this.valorTotalRecebido = recsBrutos.filter(r => r.status === 'recebido').reduce((sum, r) => sum + r.valor, 0);
      this.valorTotalPendente = recsBrutos.filter(r => r.status === 'pendente').reduce((sum, r) => sum + r.valor, 0);

      // Enriquecer recebimentos com dados de venda e cliente
      const recsEnriquecidos: RecebimentoExibicao[] = [];
      for (const rec of recsBrutos) {
        const venda = await this.vendaService.buscarPorId(rec.venda_id);
        recsEnriquecidos.push({
          ...rec,
          cliente_nome: venda?.cliente_nome || 'Cliente Desconhecido',
          data_venda: venda?.data_venda || rec.data_recebimento,
          itens_count: venda?.itens?.length || 0
        });
      }
      this.recebimentos = recsEnriquecidos;

      console.log('Relatórios - Dados carregados com sucesso.');
    } catch (error) {
      console.error('Erro ao carregar dados para relatórios:', error);
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Trata a alteração do tipo de relatório no segmento.
   */
  onTipoChange(event: any) {
    this.filtroTipo = event.detail.value;
  }

  /**
   * Retorna os produtos filtrados pela busca de nome/categoria.
   */
  getProdutosFiltrados(): Produto[] {
    if (!this.buscaTermo.trim()) {
      return this.produtos;
    }
    const termo = this.buscaTermo.toLowerCase().trim();
    return this.produtos.filter(p => 
      p.nome.toLowerCase().includes(termo) || 
      p.categoria.toLowerCase().includes(termo)
    );
  }

  /**
   * Retorna os clientes filtrados pela busca de nome/email/telefone/documento.
   */
  getClientesFiltrados(): Cliente[] {
    if (!this.buscaTermo.trim()) {
      return this.clientes;
    }
    const termo = this.buscaTermo.toLowerCase().trim();
    return this.clientes.filter(c => 
      c.nome.toLowerCase().includes(termo) ||
      (c.email && c.email.toLowerCase().includes(termo)) ||
      c.cpf_cnpj.toLowerCase().includes(termo)
    );
  }

  /**
   * Retorna as vendas filtradas pelo status e pela busca (nome do cliente).
   */
  getVendasFiltradas(): Venda[] {
    let list = this.vendas;

    // Filtro por status
    if (this.filtroStatusVenda === 'pendentes') {
      list = list.filter(v => v.status === 'pendente');
    } else if (this.filtroStatusVenda === 'pagas') {
      list = list.filter(v => v.status === 'paga');
    }

    // Filtro por busca (cliente)
    if (this.buscaTermo.trim()) {
      const termo = this.buscaTermo.toLowerCase().trim();
      list = list.filter(v => 
        (v.cliente_nome && v.cliente_nome.toLowerCase().includes(termo))
      );
    }

    return list;
  }

  /**
   * Retorna os recebimentos filtrados pelo status e pela busca (nome do cliente).
   */
  getRecebimentosFiltrados(): RecebimentoExibicao[] {
    let list = this.recebimentos;

    // Filtro por status
    if (this.filtroStatusRecebimento === 'pendentes') {
      list = list.filter(r => r.status === 'pendente');
    } else if (this.filtroStatusRecebimento === 'pagos') {
      list = list.filter(r => r.status === 'recebido');
    }

    // Filtro por busca (cliente)
    if (this.buscaTermo.trim()) {
      const termo = this.buscaTermo.toLowerCase().trim();
      list = list.filter(r => 
        (r.cliente_nome && r.cliente_nome.toLowerCase().includes(termo))
      );
    }

    return list;
  }

  /**
   * Formata valores para moeda local (BRL).
   */
  formatarMoeda(valor: number): string {
    return formatarMoedaUtil(valor);
  }
}

