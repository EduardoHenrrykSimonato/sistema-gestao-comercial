import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
  IonSegment, IonSegmentButton, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cashOutline, walletOutline, checkmarkCircleOutline, closeCircleOutline,
  calendarOutline, personOutline, cartOutline, receiptOutline,
  alertCircleOutline, timeOutline, checkmarkDoneOutline,
  cardOutline, chevronDownOutline
} from 'ionicons/icons';
import { FinanceiroService } from '../../../services/financeiro.service';
import { VendaService } from '../../../services/venda.service';
import { Recebimento } from '../../../models/recebimento.model';
import { Venda } from '../../../models/venda.model';

interface RecebimentoExibicao extends Recebimento {
  cliente_nome?: string;
  data_venda?: string;
  itens_count?: number;
}

@Component({
  selector: 'app-receber',
  templateUrl: './receber.page.html',
  styleUrls: ['./receber.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
    IonSegment, IonSegmentButton, IonBadge
  ]
})
export class ReceberPage implements OnInit {

  // Aba selecionada
  segmentoAtivo: string = 'pendentes';

  // Listas
  recebimentosPendentes: RecebimentoExibicao[] = [];
  recebimentosPagos: RecebimentoExibicao[] = [];

  // Formulário de confirmação de pagamento
  recebimentoSelecionado: RecebimentoExibicao | null = null;
  formaPagamento: string = '';
  dataRecebimento: string = '';

  // Loading
  carregando: boolean = false;
  confirmando: boolean = false;

  constructor(
    private financeiroService: FinanceiroService,
    private vendaService: VendaService
  ) {
    addIcons({
      cashOutline, walletOutline, checkmarkCircleOutline, closeCircleOutline,
      calendarOutline, personOutline, cartOutline, receiptOutline,
      alertCircleOutline, timeOutline, checkmarkDoneOutline,
      cardOutline, chevronDownOutline
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  /**
   * Carrega todos os recebimentos e enriquece com dados da venda.
   */
  async carregarDados() {
    this.carregando = true;
    try {
      const todos = await this.financeiroService.listarRecebimentos();
      console.log('Recebimentos carregados:', todos);

      // Enriquecer com dados da venda (cliente_nome, data_venda, etc.)
      const pendentes: RecebimentoExibicao[] = [];
      const pagos: RecebimentoExibicao[] = [];

      for (const rec of todos) {
        const venda = await this.vendaService.buscarPorId(rec.venda_id);
        const exibicao: RecebimentoExibicao = {
          ...rec,
          cliente_nome: venda?.cliente_nome || 'Cliente Desconhecido',
          data_venda: venda?.data_venda || rec.data_recebimento,
          itens_count: venda?.itens?.length || 0
        };

        if (rec.status === 'pendente') {
          pendentes.push(exibicao);
        } else {
          pagos.push(exibicao);
        }
      }

      this.recebimentosPendentes = pendentes;
      this.recebimentosPagos = pagos;

      console.log('Pendentes:', this.recebimentosPendentes);
      console.log('Pagos:', this.recebimentosPagos);
    } catch (error) {
      console.error('Erro ao carregar recebimentos:', error);
    } finally {
      this.carregando = false;
    }
  }

  /**
   * Troca o segmento ativo (Pendentes / Pagos).
   */
  onSegmentChange(event: any) {
    this.segmentoAtivo = event.detail.value;
    // Fecha o formulário ao trocar de aba
    this.cancelarConfirmacao();
  }

  /**
   * Abre o formulário de confirmação de pagamento para um recebimento.
   */
  abrirConfirmacao(recebimento: RecebimentoExibicao) {
    this.recebimentoSelecionado = recebimento;
    this.formaPagamento = '';
    this.dataRecebimento = new Date().toISOString().split('T')[0];
  }

  /**
   * Cancela e fecha o formulário de confirmação.
   */
  cancelarConfirmacao() {
    this.recebimentoSelecionado = null;
    this.formaPagamento = '';
    this.dataRecebimento = '';
  }

  /**
   * Confirma o recebimento (registra pagamento).
   */
  async confirmarRecebimento() {
    if (!this.recebimentoSelecionado) return;

    // Validações
    if (!this.formaPagamento) {
      alert('Selecione a forma de pagamento.');
      return;
    }

    if (!this.dataRecebimento) {
      alert('Informe a data de recebimento.');
      return;
    }

    this.confirmando = true;

    try {
      const recebimentoAtualizado: Recebimento = {
        ...this.recebimentoSelecionado,
        forma_pagamento: this.formaPagamento,
        data_recebimento: this.dataRecebimento,
        status: 'recebido'
      };

      await this.financeiroService.registrarRecebimento(recebimentoAtualizado);

      console.log('Recebimento confirmado com sucesso:', recebimentoAtualizado);
      alert('Pagamento registrado com sucesso!');

      // Limpa e recarrega
      this.cancelarConfirmacao();
      await this.carregarDados();
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      alert('Erro ao registrar pagamento. Tente novamente.');
    } finally {
      this.confirmando = false;
    }
  }

  /**
   * Formata valor monetário para exibição.
   */
  formatarMoeda(valor: number): string {
    return valor.toFixed(2).replace('.', ',');
  }
}
