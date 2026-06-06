import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonButton,
  IonList
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
    IonList
  ]
})
export class ProdutosPage implements OnInit {

  // List
  produtos: Produto[] = [];

  // Current product object
  produto: any = {
    id: undefined,
    nome: '',
    categoria: '',
    preco: '',
    estoque: ''
  };

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

    if (this.produto.preco === null || this.produto.preco === undefined || this.produto.preco === '' || Number(this.produto.preco) <= 0) {
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
        categoria: this.produto.categoria ? this.produto.categoria.trim() : '',
        preco: Number(this.produto.preco),
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
}
