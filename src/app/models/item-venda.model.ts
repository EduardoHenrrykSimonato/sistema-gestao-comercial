export interface ItemVenda {
  id?: number;
  venda_id?: number;
  produto_id: number;
  produto_nome?: string;
  quantidade: number;
  valor_unitario: number;
  subtotal: number;
}
