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
  peopleOutline, personOutline, callOutline, mailOutline, mapOutline,
  documentTextOutline
} from 'ionicons/icons';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon,
    IonCard, IonCardContent, IonItem, IonInput, IonButton,
    IonList, IonListHeader, IonLabel
  ]
})
export class ClientesPage implements OnInit {

  // Form fields
  nome: string = '';
  cpf_cnpj: string = '';
  telefone: string = '';
  email: string = '';
  endereco: string = '';

  // Edit control
  clienteIdParaEditar: number | null = null;

  // List
  clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService) {
    addIcons({
      trashOutline, pencilOutline, saveOutline, closeCircleOutline,
      peopleOutline, personOutline, callOutline, mailOutline, mapOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    this.carregarClientes();
  }

  async carregarClientes() {
    try {
      this.clientes = await this.clienteService.listarTodos();
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  async onSalvar() {
    // Validations
    if (!this.nome || !this.nome.trim()) {
      alert('Preencha o nome do cliente.');
      return;
    }

    const clienteDados: Cliente = {
      nome: this.nome.trim(),
      cpf_cnpj: this.cpf_cnpj ? this.cpf_cnpj.trim() : '',
      telefone: this.telefone ? this.telefone.trim() : '',
      email: this.email ? this.email.trim() : '',
      endereco: this.endereco ? this.endereco.trim() : ''
    };

    try {
      if (this.clienteIdParaEditar !== null) {
        // Edit mode
        clienteDados.id = this.clienteIdParaEditar;
        await this.clienteService.atualizar(clienteDados);
        alert('Cliente atualizado com sucesso!');
      } else {
        // Create mode
        await this.clienteService.cadastrar(clienteDados);
        alert('Cliente cadastrado com sucesso!');
      }

      this.limparFormulario();
      await this.carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente.');
    }
  }

  onEditar(c: Cliente) {
    this.clienteIdParaEditar = c.id || null;
    this.nome = c.nome;
    this.cpf_cnpj = c.cpf_cnpj;
    this.telefone = c.telefone;
    this.email = c.email;
    this.endereco = c.endereco;
  }

  async onExcluir(id: number | undefined) {
    if (!id) return;

    const confirmar = confirm('Deseja realmente excluir este cliente?');
    if (!confirmar) return;

    try {
      await this.clienteService.remover(id);
      alert('Cliente excluído com sucesso!');
      
      // Se estiver editando o cliente excluído, limpa o form
      if (this.clienteIdParaEditar === id) {
        this.limparFormulario();
      }
      
      await this.carregarClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente.');
    }
  }

  limparFormulario() {
    this.nome = '';
    this.cpf_cnpj = '';
    this.telefone = '';
    this.email = '';
    this.endereco = '';
    this.clienteIdParaEditar = null;
  }
}
