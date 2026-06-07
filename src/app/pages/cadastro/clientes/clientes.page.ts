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
    IonList
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
      this.clientes = await this.clienteService.listar();
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }

  formatarCpfCnpj(value: string): string {
    if (!value) return '';
    const limpo = value.replace(/\D/g, '');
    if (limpo.length <= 11) {
      let formatted = limpo;
      if (limpo.length > 3) {
        formatted = limpo.substring(0, 3) + '.' + limpo.substring(3);
      }
      if (limpo.length > 6) {
        formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
      }
      if (limpo.length > 9) {
        formatted = formatted.substring(0, 11) + '-' + formatted.substring(11, 13);
      }
      return formatted.substring(0, 14);
    } else {
      let formatted = limpo;
      if (limpo.length > 2) {
        formatted = limpo.substring(0, 2) + '.' + limpo.substring(2);
      }
      if (limpo.length > 5) {
        formatted = formatted.substring(0, 6) + '.' + formatted.substring(6);
      }
      if (limpo.length > 8) {
        formatted = formatted.substring(0, 10) + '/' + formatted.substring(10);
      }
      if (limpo.length > 12) {
        formatted = formatted.substring(0, 15) + '-' + formatted.substring(15, 17);
      }
      return formatted.substring(0, 18);
    }
  }

  formatarTelefone(value: string): string {
    if (!value) return '';
    const limpo = value.replace(/\D/g, '');
    let formatted = limpo;
    if (limpo.length > 0) {
      formatted = '(' + limpo;
    }
    if (limpo.length > 2) {
      formatted = '(' + limpo.substring(0, 2) + ') ' + limpo.substring(2);
    }
    if (limpo.length > 6 && limpo.length <= 10) {
      formatted = '(' + limpo.substring(0, 2) + ') ' + limpo.substring(2, 6) + '-' + limpo.substring(6, 10);
    } else if (limpo.length > 10) {
      formatted = '(' + limpo.substring(0, 2) + ') ' + limpo.substring(2, 7) + '-' + limpo.substring(7, 11);
    }
    return formatted.substring(0, 15);
  }

  onCpfCnpjInput(event: any) {
    const value = event.target.value || '';
    this.cpf_cnpj = this.formatarCpfCnpj(value);
    event.target.value = this.cpf_cnpj;
  }

  onTelefoneInput(event: any) {
    const value = event.target.value || '';
    this.telefone = this.formatarTelefone(value);
    event.target.value = this.telefone;
  }

  async onSalvar() {
    // Validations
    if (!this.nome || !this.nome.trim()) {
      alert('Preencha o nome do cliente.');
      return;
    }

    // CPF/CNPJ Validation
    if (this.cpf_cnpj) {
      const cpfCnpjLimpo = this.cpf_cnpj.replace(/\D/g, '');
      if (cpfCnpjLimpo.length > 0 && cpfCnpjLimpo.length !== 11 && cpfCnpjLimpo.length !== 14) {
        alert('CPF/CNPJ inválido.');
        return;
      }
    }

    // Telefone Validation
    if (this.telefone) {
      const telefoneLimpo = this.telefone.replace(/\D/g, '');
      if (telefoneLimpo.length > 0 && (telefoneLimpo.length < 10 || telefoneLimpo.length > 11)) {
        alert('Telefone inválido.');
        return;
      }
    }

    // E-mail Validation
    if (this.email && this.email.trim()) {
      const emailTrim = this.email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrim)) {
        alert('E-mail inválido.');
        return;
      }
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
        alert('Cliente salvo com sucesso.'); // Updated to match user's expected "Cliente salvo com sucesso." alert
      } else {
        // Create mode
        await this.clienteService.inserir(clienteDados);
        alert('Cliente salvo com sucesso.'); // Updated to match user's expected "Cliente salvo com sucesso." alert
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
      await this.clienteService.excluir(id);
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
