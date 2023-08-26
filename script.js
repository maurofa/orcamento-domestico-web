const path = 'http://127.0.0.1:5000';

/*
 Função para obter o orçamento mensal ou anual
*/
const getOrcamento = async (mes, ano) => {
  let url = path + '/orcamento';
  if (!!ano) {
    url = url + '?ano=' + ano;
    if (!!mes) {
      url += '&mes='+mes;
    }
  }
  fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => data.orcamento.forEach(lancamento => insertList(lancamento)))
    .catch((error) => console.error('Error:', error));
}

getOrcamento();

function insertList(lancamento) {
  let item = [lancamento.id, lancamento.dataDoFato, lancamento.descricao, lancamento.valor, lancamento.ehReceita, lancamento.subGrupo];
  let tabela = document.getElementById('minhaTabela');
  var linha = table.insertRow();

  for (let i = 0; i < item.length; i++) {
    let cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1));
  document.getElementById("")
}

