/**
 * Utilitário de formatação e conversão monetária (R$ - Real Brasileiro).
 * Centraliza a lógica para uso em todo o sistema.
 */

/**
 * Formata um valor numérico para exibição em moeda brasileira.
 * @param valor Valor numérico a ser formatado.
 * @returns String formatada sem o símbolo "R$" (ex: "1.250,50").
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor || 0);
}

/**
 * Formata um valor numérico para exibição completa em moeda brasileira com símbolo.
 * @param valor Valor numérico a ser formatado.
 * @returns String formatada com o símbolo "R$" (ex: "R$ 1.250,50").
 */
export function formatarMoedaCompleta(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
}

/**
 * Converte um valor monetário em string para número.
 * Aceita formatos: "10", "10.50", "10,50", "R$ 10,50", "1.250,90".
 * @param valor Valor em qualquer formato aceito.
 * @returns Valor numérico ou 0 se inválido.
 */
export function converterValorMonetario(valor: any): number {
  if (valor === null || valor === undefined || valor === '') {
    return 0;
  }

  if (typeof valor === 'number') {
    return valor;
  }

  let str = String(valor).trim();

  // Remove "R$" e espaços
  str = str.replace(/R\$/g, '').trim();

  // Detectar formato brasileiro: se tem vírgula como separador decimal
  if (str.includes(',')) {
    // Remove pontos de milhar e troca vírgula por ponto
    str = str.replace(/\./g, '').replace(',', '.');
  }

  const resultado = parseFloat(str);

  if (isNaN(resultado)) {
    return 0;
  }

  return resultado;
}
