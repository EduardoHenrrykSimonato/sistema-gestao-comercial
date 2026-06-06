import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline, personOutline, cubeOutline, addOutline, trashOutline,
  checkmarkCircleOutline, closeCircleOutline, calendarOutline, cashOutline,
  alertCircleOutline
} from 'ionicons/icons';
import { VendaService } from '../../services/venda.service';
import { ClienteService } from '../../services/cliente.service';
import { ProdutoService } from '../../services/produto.service';
import { Venda } from '../../models/venda.model';
import { ItemVenda } from '../../models/item-venda.model';
import { Cliente } from '../../models/cliente.model';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.page.html',
  styleUrls: ['./vendas.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton,
    IonList
  ]
})
export class VendasPage implements OnInit {

  // Data lists
  clientes: Cliente[] = [];
  produtos: Produto[] = [];
  vendasRealizadas: Venda[] = [];

  // Form selections
  clienteSelecionadoId: number | null = null;
  produtoSelecionadoId: number | null = null;
  quantidadeSelecionada: number | null = null;

  // Items added to the current sale
  itensAdicionados: ItemVenda[] = [];
  totalVenda: number = 0;

  constructor(
    private vendaService: VendaService,
    private clienteService: ClienteService,
    private produtoService: ProdutoService
  ) {
    addIcons({
      cartOutline, personOutline, cubeOutline, addOutline, trashOutline,
      checkmarkCircleOutline, closeCircleOutline, calendarOutline, cashOutline,
      alertCircleOutline
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    try {
      await this.carregarClientes();
      await this.carregarProdutos();
      await this.carregarVendasRealizadas();
    } catch (error) {
      console.error('Erro ao inicializar dados da página de vendas:', error);
    }
  }

  async carregarClientes() {
    this.clientes = await this.clienteService.listar();
    console.log('Clientes carregados para vendas:', this.clientes);
  }

  async carregarProdutos() {
    this.produtos = await this.produtoService.listar();
    console.log('Produtos carregados para vendas:', this.produtos);
  }

  async carregarVendasRealizadas() {
    this.vendasRealizadas = await this.vendaService.listarVendas();
    console.log('Vendas realizadas carregadas:', this.vendasRealizadas);
  }

  /**
   * Adiciona o produto selecionado à lista local de itens da venda.
   */
  async adicionarProduto() {
    if (!this.produtoSelecionadoId) {
      alert('Selecione um produto.');
      return;
    }

    if (this.quantidadeSelecionada === null || this.quantidadeSelecionada === undefined || this.quantidadeSelecionada <= 0) {
      alert('Informe uma quantidade válida e maior que zero.');
      return;
    }

    const produto = this.produtos.find(p => p.id === this.produtoSelecionadoId);
    if (!produto) {
      alert('Produto não encontrado.');
      return;
    }

    // Valida o estoque disponível do produto
    const estoqueDisponivel = produto.estoque;
    
    // Verifica se já existe o produto adicionado e calcula a quantidade acumulada desejada
    const itemExistente = this.itensAdicionados.find(item => item.produto_id === this.produtoSelecionadoId);
    const quantidadeAcumulada = (itemExistente ? itemExistente.quantidade : 0) + this.quantidadeSelecionada;

    if (quantidadeAcumulada > estoqueDisponivel) {
      alert(`Quantidade indisponível em estoque. Estoque disponível: ${estoqueDisponivel} un. ${itemExistente ? `(Já adicionado: ${itemExistente.quantidade} un.)` : ''}`);
      return;
    }

    if (itemExistente) {
      // Atualiza o item existente
      itemExistente.quantidade = quantidadeAcumulada;
      itemExistente.subtotal = itemExistente.quantidade * itemExistente.valor_unitario;
      console.log('Produto atualizado na lista local (acumulado):', itemExistente);
    } else {
      // Adiciona um novo item à lista
      const novoItem: ItemVenda = {
        produto_id: produto.id!,
        produto_nome: produto.nome,
        quantidade: this.quantidadeSelecionada,
        valor_unitario: produto.preco,
        subtotal: this.quantidadeSelecionada * produto.preco
      };
      this.itensAdicionados.push(novoItem);
      console.log('Produto adicionado à lista local:', novoItem);
    }

    // Limpa os campos de seleção do produto
    this.produtoSelecionadoId = null;
    this.quantidadeSelecionada = null;

    // Recalcula o total geral
    this.atualizarTotal();
  }

  /**
   * Remove o item da lista local.
   */
  removerProduto(index: number) {
    this.itensAdicionados.splice(index, 1);
    this.atualizarTotal();
  }

  /**
   * Recalcula o total somando os subtotais locais.
   */
  atualizarTotal() {
    this.totalVenda = this.vendaService.calcularTotal(this.itensAdicionados);
  }

  /**
   * Finaliza a venda enviando os dados para o service e limpando a tela.
   */
  async finalizarVenda() {
    // 1. Validar cliente selecionado
    if (!this.clienteSelecionadoId) {
      alert('Selecione o cliente para finalizar a venda.');
      return;
    }

    // 2. Validar se há itens na venda
    if (this.itensAdicionados.length === 0) {
      alert('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    // 3. Validar estoque final (double check)
    for (const item of this.itensAdicionados) {
      const estoqueOk = await this.vendaService.validarEstoque(item.produto_id, item.quantidade);
      if (!estoqueOk) {
        alert(`O estoque do produto "${item.produto_nome}" mudou ou é insuficiente.`);
        return;
      }
    }

    try {
      console.log('Finalizando venda...');
      const vendaDados: Venda = {
        cliente_id: this.clienteSelecionadoId,
        data_venda: new Date().toISOString().split('T')[0],
        total: this.totalVenda,
        status: 'pendente'
      };

      console.log('Venda a ser enviada ao service:', vendaDados, this.itensAdicionados);
      
      const vendaId = await this.vendaService.criar(vendaDados, this.itensAdicionados);
      console.log('Venda concluída no banco. ID gerado:', vendaId);

      alert('Venda realizada com sucesso.');

      // Reseta e recarrega os dados
      this.limparFormulario();
      await this.carregarProdutos(); // Atualiza estoques exibidos
      await this.carregarVendasRealizadas(); // Atualiza a listagem de vendas
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda.');
    }
  }

  /**
   * Limpa o formulário de venda atual.
   */
  limparFormulario() {
    this.clienteSelecionadoId = null;
    this.produtoSelecionadoId = null;
    this.quantidadeSelecionada = null;
    this.itensAdicionados = [];
    this.totalVenda = 0;
  }
}
