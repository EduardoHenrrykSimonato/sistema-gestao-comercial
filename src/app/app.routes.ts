import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/cadastro/cadastro.page').then(m => m.CadastroPage)
  },
  {
    path: 'cadastro/usuarios',
    loadComponent: () => import('./pages/cadastro/usuarios/usuarios.page').then(m => m.UsuariosPage)
  },
  {
    path: 'cadastro/produtos',
    loadComponent: () => import('./pages/cadastro/produtos/produtos.page').then(m => m.ProdutosPage)
  },
  {
    path: 'cadastro/clientes',
    loadComponent: () => import('./pages/cadastro/clientes/clientes.page').then(m => m.ClientesPage)
  },
  {
    path: 'vendas',
    loadComponent: () => import('./pages/vendas/vendas.page').then(m => m.VendasPage)
  },
  {
    path: 'financeiro',
    loadComponent: () => import('./pages/financeiro/financeiro.page').then(m => m.FinanceiroPage)
  },
  {
    path: 'financeiro/receber',
    loadComponent: () => import('./pages/financeiro/receber/receber.page').then(m => m.ReceberPage)
  },
  {
    path: 'relatorios',
    loadComponent: () => import('./pages/relatorios/relatorios.page').then(m => m.RelatoriosPage)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
