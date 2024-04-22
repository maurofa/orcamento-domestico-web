import objetivos from "../assets/objetivos.json";

export default function Objetivos() {
  return objetivos;
}

export const adicionaObjetivoNaBase = (objetivo) => {
  Objetivos().push(objetivo);
  return objetivo;
}

export const alteraObjetivoNaBase = (objetivo) => {
  const objetivoAtual = Objetivos().find(obj => obj.id === objetivo.id);
  objetivoAtual.valor = objetivo.valor;
  objetivoAtual.valorAlocado = objetivo.valorAlocado;
  return objetivoAtual;
}

export const concluiObjetivoNaBase = (objetivo) => {
  const lancamento = {
    idSubgrupo: 65,
    descricao: "Conclusão do objetivo " + objetivo.descricao,
    dataDaCompra: new Date(),
    ehCredito: true,
  }
  //incluiLancamentoNaBase(lancamento);
  return Objetivos().filter(obj => obj.id !== objetivo.id);
}
