import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonButton,
  IonList, IonListHeader, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, pencilOutline, saveOutline, closeCircleOutline,
  cubeOutline, pricetagOutline, alertCircleOutline
} from 'ionicons/icons';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent, IonItem, IonInput, IonButton,
    IonList, IonListHeader, IonLabel
  ]
})
export class ProdutosPage implements OnInit {

  // Form fields
  nome: string = '';
  categoria: string = '';
  preco: string = '';
  estoque: string = '';

  // Edit control
  produtoIdParaEditar: number | null = null;

  // List
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) {
    addIcons({
      trashOutline, pencilOutline, saveOutline, closeCircleOutline,
      cubeOutline, pricetagOutline, alertCircleOutline
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  async carregarProdutos() {
    try {
      this.produtos = await this.produtoService.listarTodos();
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }

  async onSalvar() {
    // Validations
    if (!this.nome || !this.nome.trim()) {
      alert('Preencha o nome do produto.');
      return;
    }

    if (this.preco === null || this.preco === undefined || this.preco === '') {
      alert('Preencha o preço do produto.');
      return;
    }

    const precoNum = Number(this.preco);
    if (isNaN(precoNum) || precoNum <= 0) {
      alert('O preço deve ser um número maior que zero.');
      return;
    }

    if (this.estoque === null || this.estoque === undefined || this.estoque === '') {
      alert('Preencha a quantidade em estoque.');
      return;
    }

    const estoqueNum = Number(this.estoque);
    if (isNaN(estoqueNum) || estoqueNum < 0 || !Number.isInteger(estoqueNum)) {
      alert('O estoque deve ser um número inteiro maior ou igual a zero.');
      return;
    }

    const produtoDados: Produto = {
      nome: this.nome.trim(),
      categoria: this.categoria ? this.categoria.trim() : '',
      preco: precoNum,
      estoque: estoqueNum
    };

    try {
      if (this.produtoIdParaEditar !== null) {
        // Edit mode
        produtoDados.id = this.produtoIdParaEditar;
        await this.produtoService.atualizar(produtoDados);
        alert('Produto atualizado com sucesso!');
      } else {
        // Create mode
        await this.produtoService.cadastrar(produtoDados);
        alert('Produto cadastrado com sucesso!');
      }

      this.limparFormulario();
      await this.carregarProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto.');
    }
  }

  onEditar(p: Produto) {
    this.produtoIdParaEditar = p.id || null;
    this.nome = p.nome;
    this.categoria = p.categoria;
    this.preco = p.preco.toString();
    this.estoque = p.estoque.toString();
  }

  async onExcluir(id: number | undefined) {
    if (!id) return;

    const confirmar = confirm('Deseja realmente excluir este produto?');
    if (!confirmar) return;

    try {
      await this.produtoService.remover(id);
      alert('Produto excluído com sucesso!');
      
      // Se estiver editando o produto excluído, limpa o form
      if (this.produtoIdParaEditar === id) {
        this.limparFormulario();
      }
      
      await this.carregarProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto.');
    }
  }

  limparFormulario() {
    this.nome = '';
    this.categoria = '';
    this.preco = '';
    this.estoque = '';
    this.produtoIdParaEditar = null;
  }
}
