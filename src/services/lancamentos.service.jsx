import axios from "axios";

const client = axios.create({baseURL: 'http://localhost:5000/lancamentos'});

const ordenaListaLancamento = (lancamentos) => {
  lancamentos.sort((a, b) => {
    if (b.dataDePagamento && a.dataDePagamento - b.dataDePagamento !== 0) {
      return a.dataDePagamento - b.dataDePagamento;
    }
    if (a.dataDaCompra - b.dataDaCompra !== 0) {
      return a.dataDaCompra - b.dataDaCompra;
    }
    return a.id - b.id;
  });
}

const preencheLancamentos = (lancamentosList) => {
  let copia = lancamentosList
    .map(lancamento => preencheUmLancamentoSemSaldo(lancamento));

  ordenaListaLancamento(copia);

  let saldoAtual = 0;
  return copia.map(lancamento => {
    saldoAtual += lancamento.valor;
    lancamento.saldo = saldoAtual;
    return lancamento;
  });
}

const preencheUmLancamentoSemSaldo = (lancamento) => {
  const retorno = { ...lancamento };
  retorno.subGrupoId = lancamento.subGrupo.id;
  const valor = Math.abs(lancamento.valor);
  retorno.valor = lancamento.ehCredito ? valor : -valor;
  retorno.dataDaCompra = new Date(lancamento.dataDaCompra);
  retorno.dataDePagamento = lancamento.ehCredito || lancamento.compraNoDebito ? new Date(lancamento.dataDaCompra) : new Date(lancamento.dataDePagamento);
  return retorno;
}

const getLancamentos = () => {

  return client.get('')
    .then(response => preencheLancamentos(response.data.lancamentos));

}

export default getLancamentos;

const dataDentroDoMes = (data) => {
  const dataInput = new Date(data);
  const agora = new Date();
  const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
  return dataInput >= primeiroDia && dataInput <= ultimoDia;
}

export const atualizaTabelaComLancamento = (lancamento, lancamentosList) => {
  const formData = new FormData();
  if (lancamento.id) {
    formData.append("id", lancamento.id);
  }
  formData.append("compraNoDebito", lancamento.compraNoDebito);
  formData.append("dataDaCompra", new Date(lancamento.dataDaCompra).toISOString().split('T')[0]);
  if (lancamento.dataDePagamento) {
    formData.append("dataDePagamento", new Date(lancamento.dataDePagamento).toISOString().split('T')[0]);
  }
  formData.append("descricao", lancamento.descricao);
  formData.append("ehCredito", lancamento.ehCredito);
  if (lancamento.quantidadeDeParcelas) {
    formData.append("quantidadeDeParcelas", lancamento.quantidadeDeParcelas);
  }
  formData.append("subGrupoId", lancamento.subGrupoId);
  formData.append("valor", Math.abs(lancamento.valor));
  if (lancamento.id) {
    return client.put(`/${lancamento.id}/alterar`, formData)
      .then(response => adicionaUmLancamentoNaLista(response.data, lancamentosList));
  } else if (lancamento.ehCredito || lancamento.compraNoDebito ? dataDentroDoMes(lancamento.dataDaCompra) : dataDentroDoMes(lancamento.dataDePagamento)) {
    return client.post('', formData)
      .then(response => adicionaUmLancamentoNaLista(response.data, lancamentosList));
  }
  console.log("Você não pode adicionar um pagamento fora do mês.");
  throw new Error("Não pode adicionar um lançamento fora do mês.");
}

const adicionaUmLancamentoNaLista = (lancamento, lancamentosList) => {
  const lancamentos = lancamentosList.filter(lance => lance.id !== lancamento.id);
  lancamentos.push(preencheUmLancamentoSemSaldo(lancamento));
  return preencheLancamentos(lancamentos);
}

function calculaSaldo(lancamentos) {
  let saldoAtual = 0;
  return lancamentos.map(lancamento => {
    saldoAtual += lancamento.valor;
    lancamento.saldo = saldoAtual;
    return lancamento;
  });
}

const removeLancamentoDaLista = (lancamento, lancamentosList) => {
  const lancamentos = lancamentosList.filter(lance => lance.id !== lancamento.id);
  return calculaSaldo(lancamentos);
}

export const atualizaTabelaComExclusao = (lancamento, lancamentosList) => {
  return client.delete(`/${lancamento.id}/excluir`)
    .then(response => removeLancamentoDaLista(response.data, lancamentosList));
}

export const getHistoricoPorGrupo = () => {
  return [
    { value: 40, label: 'Pessoal' },
    { value: 20, label: 'Moradia' },
    { value: 10, label: 'Alimentação' },
    { value: 20, label: 'Moradia' },
    { value: 10, label: 'Outros'}
  ];
}
