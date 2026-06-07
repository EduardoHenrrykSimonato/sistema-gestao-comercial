import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
  IonCard, IonCardContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, pencilOutline, saveOutline, closeCircleOutline,
  personAddOutline, personOutline
} from 'ionicons/icons';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton,
    IonList
  ]
})
export class UsuariosPage implements OnInit {

  // Form fields
  nome: string = '';
  usuario: string = '';
  senha: string = '';
  perfil: string = '';

  // Edit control
  usuarioIdParaEditar: number | null = null;

  // List
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) {
    addIcons({
      trashOutline, pencilOutline, saveOutline, closeCircleOutline,
      personAddOutline, personOutline
    });
  }

  ngOnInit() {
    this.carregarUsuarios();
  }

  async carregarUsuarios() {
    try {
      this.usuarios = await this.usuarioService.listar();
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  async onSalvar() {
    // Validations
    if (!this.nome || !this.nome.trim()) {
      alert('Preencha o nome do usuário.');
      return;
    }
    if (!this.usuario || !this.usuario.trim()) {
      alert('Preencha o login do usuário.');
      return;
    }
    if (!this.senha || !this.senha.trim()) {
      alert('Preencha a senha do usuário.');
      return;
    }
    if (!this.perfil) {
      alert('Selecione o perfil do usuário.');
      return;
    }

    // Check duplication
    const todos = await this.usuarioService.listar();
    const duplicado = todos.some(
      u => u.usuario.toLowerCase() === this.usuario.trim().toLowerCase() && u.id !== this.usuarioIdParaEditar
    );

    if (duplicado) {
      alert('Usuário já cadastrado.');
      return;
    }

    const usuarioDados: Usuario = {
      nome: this.nome.trim(),
      usuario: this.usuario.trim(),
      senha: this.senha.trim(),
      perfil: this.perfil
    };

    try {
      if (this.usuarioIdParaEditar !== null) {
        // Edit mode
        usuarioDados.id = this.usuarioIdParaEditar;
        await this.usuarioService.atualizar(usuarioDados);
        alert('Usuário atualizado com sucesso!');
      } else {
        // Create mode
        await this.usuarioService.inserir(usuarioDados);
        alert('Usuário cadastrado com sucesso!');
      }

      this.limparFormulario();
      await this.carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário. Verifique se o login já existe.');
    }
  }

  onEditar(u: Usuario) {
    this.usuarioIdParaEditar = u.id || null;
    this.nome = u.nome;
    this.usuario = u.usuario;
    this.senha = u.senha;
    this.perfil = u.perfil;
  }

  async onExcluir(id: number | undefined) {
    if (!id) return;

    const confirmar = confirm('Deseja realmente excluir este usuário?');
    if (!confirmar) return;

    try {
      await this.usuarioService.excluir(id);
      alert('Usuário excluído com sucesso!');
      
      // Se estiver editando o usuário excluído, limpa o form
      if (this.usuarioIdParaEditar === id) {
        this.limparFormulario();
      }
      
      await this.carregarUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário.');
    }
  }

  limparFormulario() {
    this.nome = '';
    this.usuario = '';
    this.senha = '';
    this.perfil = '';
    this.usuarioIdParaEditar = null;
  }
}
