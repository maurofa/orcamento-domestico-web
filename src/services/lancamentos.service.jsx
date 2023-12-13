import lancametosList from '../assets/lancamentos.json';
import { getSubgrupo } from "./grupo.service";

const dataDentroDoMes = (data) => {
  const dataInput = new Date(data);
  const agora = new Date();
  const primeiroDia = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const ultimoDia = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);
  return dataInput >= primeiroDia && dataInput <= ultimoDia;
}

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

const Lancamentos = () => {

  let copia = lancametosList.dados
    .filter(lancamento => lancamento.ehCredito || lancamento.compraNoDebito ? dataDentroDoMes(lancamento.dataDaCompra)
      : dataDentroDoMes(lancamento.dataDePagamento));

  ordenaListaLancamento(copia);

  let saldoAtual = 0;
  return copia.map(lancamento => {
    const retorno = {
      id: lancamento.id,
      descricao: lancamento.descricao,
      idSubgrupo: lancamento.idSubgrupo,
      subgrupo: getSubgrupo(lancamento.idSubgrupo),
      valor: lancamento.ehCredito ? lancamento.valor : -lancamento.valor,
      dataDaCompra: new Date(lancamento.dataDaCompra),
      dataDePagamento: lancamento.ehCredito || lancamento.compraNoDebito ? new Date(lancamento.dataDaCompra) : new Date(lancamento.dataDePagamento),
      quantidadeDeParcelas: lancamento.quantidadeDeParcelas,
    };
    saldoAtual += retorno.valor;
    retorno.saldo = saldoAtual;
    return retorno;
  });
}

export default Lancamentos;

export const atualizaTabelaComLancamento = ({ lancamento }) => {
  const lancamentos = Lancamentos();
  if (lancamento.id) {
    const lancamentoAnterior = lancamentos.find(lance => lance.id === lancamento.id);
    lancamentoAnterior.subgrupo = lancamento.subgrupo;
    lancamentoAnterior.idSubgrupo = lancamento.subgrupo.id;
    lancamentoAnterior.descricao = lancamento.descricao;
    lancamentoAnterior.dataDaCompra = lancamento.dataDaCompra;
    lancamentoAnterior.valor = lancamento.ehCredito ? lancamento.valor : -lancamento.valor;
    lancamentoAnterior.ehCredito = lancamento.ehCredito;
    lancamentoAnterior.compraNoDebito = lancamento.compraNoDebito;
    lancamentoAnterior.quantidadeDeParcelas = lancamento.quantidadeDeParcelas;
    lancamentoAnterior.dataDePagamento = lancamento.dataDePagamento;
  } else if (lancamento.ehCredito || lancamento.compraNoDebito ? dataDentroDoMes(lancamento.dataDaCompra) : dataDentroDoMes(lancamento.dataDePagamento)) {
    const lancamentoTratado = {
      id: lancamento.id,
      descricao: lancamento.descricao,
      idSubgrupo: lancamento.idSubgrupo,
      subgrupo: lancamento.subgrupo,
      valor: lancamento.ehCredito ? lancamento.valor : -lancamento.valor,
      dataDaCompra: new Date(lancamento.dataDaCompra),
      dataDePagamento: lancamento.ehCredito || lancamento.compraNoDebito ? new Date(lancamento.dataDaCompra) : new Date(lancamento.dataDePagamento),
      quantidadeDeParcelas: lancamento.quantidadeDeParcelas,
    }
    lancamentos.push(lancamentoTratado);
  }
  ordenaListaLancamento(lancamentos);
  return calculaSaldo(lancamentos);
}

function calculaSaldo(lancamentos) {
  let saldoAtual = 0;
  return lancamentos.map(lancamento => {
    saldoAtual += lancamento.valor;
    lancamento.saldo = saldoAtual;
    return lancamento;
  });
}

export const atualizaTabelaComExclusao = ({ lancamento }) => {
  let continuam = Lancamentos().filter(lance => lance.id !== lancamento.id);

  return calculaSaldo(continuam);
}

export const incluiLancamentoNaBase = (lancamento) => {
  Lancamentos().push(lancamento);
}
