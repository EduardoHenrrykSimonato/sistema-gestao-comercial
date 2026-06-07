import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonButton, IonTextarea,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, pencilOutline, saveOutline, closeCircleOutline,
  pricetagsOutline, alertCircleOutline
} from 'ionicons/icons';
import { CategoriaProdutoService } from '../../../services/categoria-produto.service';
import { CategoriaProduto } from '../../../models/categoria-produto.model';

@Component({
  selector: 'app-categorias-produto',
  templateUrl: './categorias-produto.page.html',
  styleUrls: ['./categorias-produto.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent, IonItem, IonInput, IonButton, IonTextarea,
    IonList
  ]
})
export class CategoriasProdutoPage implements OnInit {

  // Lista
  categorias: CategoriaProduto[] = [];

  // Objeto do formulário
  categoria: any = {
    id: undefined,
    nome: '',
    descricao: ''
  };

  constructor(private categoriaProdutoService: CategoriaProdutoService) {
    addIcons({
      trashOutline, pencilOutline, saveOutline, closeCircleOutline,
      pricetagsOutline, alertCircleOutline
    });
  }

  ngOnInit() {
    this.carregarCategorias();
  }

  async carregarCategorias() {
    try {
      this.categorias = await this.categoriaProdutoService.listar();
      console.log('Categorias carregadas:', this.categorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  async salvarCategoria() {
    if (!this.categoria.nome || this.categoria.nome.trim() === '') {
      alert('Informe o nome da categoria.');
      return;
    }

    try {
      // Verificar duplicidade
      const existe = await this.categoriaProdutoService.categoriaExiste(
        this.categoria.nome.trim(),
        this.categoria.id
      );

      if (existe) {
        alert('Categoria já cadastrada.');
        return;
      }

      const categoriaSalvar: CategoriaProduto = {
        id: this.categoria.id,
        nome: this.categoria.nome.trim(),
        descricao: this.categoria.descricao ? this.categoria.descricao.trim() : ''
      };

      if (categoriaSalvar.id) {
        await this.categoriaProdutoService.atualizar(categoriaSalvar);
        alert('Categoria atualizada com sucesso.');
      } else {
        await this.categoriaProdutoService.inserir(categoriaSalvar);
        alert('Categoria salva com sucesso.');
      }

      this.limparFormulario();
      await this.carregarCategorias();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria.');
    }
  }

  editarCategoria(categoria: CategoriaProduto) {
    this.categoria = {
      id: categoria.id,
      nome: categoria.nome,
      descricao: categoria.descricao || ''
    };
  }

  async excluirCategoria(id: number | undefined) {
    if (!id) return;

    const confirmar = confirm('Deseja realmente excluir esta categoria?');
    if (!confirmar) return;

    try {
      await this.categoriaProdutoService.excluir(id);
      alert('Categoria excluída com sucesso!');

      if (this.categoria.id === id) {
        this.limparFormulario();
      }

      await this.carregarCategorias();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria.');
    }
  }

  limparFormulario() {
    this.categoria = {
      id: undefined,
      nome: '',
      descricao: ''
    };
  }
}
