export interface ItemVenda {
  id?: number;
  venda_id: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
  // Campo auxiliar (não persistido, usado na UI)
  produto_nome?: string;
}
