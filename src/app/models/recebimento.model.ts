export interface Recebimento {
  id?: number;
  venda_id: number;
  data_recebimento: string;
  valor: number;
  forma_pagamento: string;
  status: string;
}
