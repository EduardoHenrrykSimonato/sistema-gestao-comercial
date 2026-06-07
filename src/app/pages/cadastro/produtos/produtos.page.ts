import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, pencilOutline, saveOutline, closeCircleOutline,
  cubeOutline, pricetagOutline, alertCircleOutline, pricetagsOutline,
  settingsOutline
} from 'ionicons/icons';
import { ProdutoService } from '../../../services/produto.service';
import { CategoriaProdutoService } from '../../../services/categoria-produto.service';
import { Produto } from '../../../models/produto.model';
import { CategoriaProduto } from '../../../models/categoria-produto.model';
import { formatarMoeda, converterValorMonetario } from '../../../utils/moeda.util';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent, IonItem, IonInput, IonButton, IonSelect, IonSelectOption,
    IonList
  ]
})
export class ProdutosPage implements OnInit {

  // List
  produtos: Produto[] = [];
  categorias: CategoriaProduto[] = [];

  // Current product object
  produto: any = {
    id: undefined,
    nome: '',
    categoria: '',
    preco: '',
    estoque: ''
  };

  constructor(
    private produtoService: ProdutoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private router: Router
  ) {
    addIcons({
      trashOutline, pencilOutline, saveOutline, closeCircleOutline,
      cubeOutline, pricetagOutline, alertCircleOutline, pricetagsOutline,
      settingsOutline
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  async carregarDados() {
    await this.carregarCategorias();
    await this.carregarProdutos();
  }

  async carregarCategorias() {
    try {
      this.categorias = await this.categoriaProdutoService.listar();
      console.log('Categorias carregadas:', this.categorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  async carregarProdutos() {
    console.log('Listando produtos...');
    try {
      this.produtos = await this.produtoService.listar();
      console.log('Produtos carregados:', this.produtos);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  async salvarProduto() {
    if (!this.produto.nome || this.produto.nome.trim() === '') {
      alert('Informe o nome do produto.');
      return;
    }

    if (!this.produto.categoria || this.produto.categoria.trim() === '') {
      alert('Selecione uma categoria.');
      return;
    }

    // Converter e validar preço
    const precoConvertido = converterValorMonetario(this.produto.preco);
    if (precoConvertido <= 0) {
      alert('Informe um preço válido.');
      return;
    }

    if (this.produto.estoque === null || this.produto.estoque === undefined || this.produto.estoque === '' || Number(this.produto.estoque) < 0) {
      alert('Informe um estoque válido.');
      return;
    }

    try {
      console.log('Salvando produto...');
      console.log('Produto enviado ao service:', this.produto);

      const produtoSalvar: Produto = {
        id: this.produto.id,
        nome: this.produto.nome.trim(),
        categoria: this.produto.categoria.trim(),
        preco: precoConvertido,
        estoque: Number(this.produto.estoque)
      };

      if (produtoSalvar.id) {
        await this.produtoService.atualizar(produtoSalvar);
        alert('Produto atualizado com sucesso.');
      } else {
        await this.produtoService.inserir(produtoSalvar);
        alert('Produto salvo com sucesso.');
      }

      this.limparFormulario();
      await this.carregarProdutos();

      console.log('Produtos carregados:', this.produtos);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto.');
    }
  }

  editarProduto(produto: Produto) {
    this.produto = {
      id: produto.id,
      nome: produto.nome,
      categoria: produto.categoria,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString()
    };
  }

  async excluirProduto(id: number | undefined) {
    if (!id) return;

    const confirmar = confirm('Deseja realmente excluir este produto?');
    if (!confirmar) return;

    try {
      await this.produtoService.excluir(id);
      alert('Produto excluído com sucesso!');

      // Se estiver editando o produto excluído, limpa o form
      if (this.produto.id === id) {
        this.limparFormulario();
      }

      await this.carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto.');
    }
  }

  limparFormulario() {
    this.produto = {
      id: undefined,
      nome: '',
      categoria: '',
      preco: '',
      estoque: ''
    };
  }

  /**
   * Formata valor numérico para exibição em moeda brasileira.
   */
  formatarMoeda(valor: number): string {
    return formatarMoeda(valor);
  }

  /**
   * Navega para a tela de gerenciamento de categorias.
   */
  irParaCategorias() {
    this.router.navigateByUrl('/cadastro/categorias-produto');
  }
}
