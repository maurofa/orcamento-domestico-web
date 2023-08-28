const path = 'http://127.0.0.1:5000';

/*
 Função para obter o orçamento mensal ou anual
*/
const getOrcamento = (mes, ano) => {
  let url = path + '/gerar_orcamento';
  if (!!ano) {
    url = url + '?ano=' + ano;
    if (!!mes) {
      url += '&mes='+mes;
    }
  }
  fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      data.orcamento.forEach(lancamento => insertList(lancamento));
      const rodape = document.getElementById('Total');
      rodape.textContent = `Quantidade de lançamentos: ${data.quantidade} Saldo: R$ ${data.saldo}`;
      removeElement();
    })
    .catch((error) => console.error('Error:', error));
}

getOrcamento();


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  const button = document.createElement("button");
  button.className = "btn-close";
  button.ariaLabel = "Close";
  parent.appendChild(button);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("btn-close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const idLancamento = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que deseja excluir este lançamento?")) {
        if (deleteItem(idLancamento)) {
          div.remove();
          alert("Removido!");
        }
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (idLancamento) => {
  console.log(idLancamento)
  let url = `${path}/${idLancamento}/excluir`;
  let excluiu = false;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => {
      excluiu = true;
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  return excluiu;
}



/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
function insertList(lancamento) {
  let item = [lancamento.id, lancamento.dataDoFato, lancamento.descricao, lancamento.valor, lancamento.ehReceita, lancamento.subGrupo.descricao];
  let tabela = document.getElementById('minhaTabela');
  let linha = tabela.insertRow();
  linha.className = lancamento.ehReceita ? 'table-success' : 'table-danger';

  for (let i = 0; i < item.length; i++) {
    let cel = linha.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(linha.insertCell(-1));
}

