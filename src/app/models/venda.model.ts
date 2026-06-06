import { ItemVenda } from './item-venda.model';

export interface Venda {
  id?: number;
  cliente_id: number;
  data_venda: string;
  total: number;
  status: string; // 'pendente' | 'paga'
  // Campos auxiliares (não persistidos, usados na UI)
  cliente_nome?: string;
  itens?: ItemVenda[];
}
