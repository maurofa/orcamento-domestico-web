const path = 'https://orcamentodomesticoapi-maurofabri.b4a.run';

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
      ordenaOrcamento(data.orcamento).forEach(lancamento => insertList(lancamento));
      const rodape = document.getElementById('Total');
      rodape.textContent = `Quantidade de lançamentos: ${data.quantidade} Saldo: R$ ${data.saldo}`;
      removeElement();
    })
    .catch((error) => console.error('Error:', error));
}

getOrcamento();

/*
  Ordena uma cópia do orçamento pela data e por receita/despesa (receita primeiro).

  Retorna esta cópia.
*/
const ordenaOrcamento = (orcamento) => {
  let copia = [...orcamento];
  copia.sort((a, b) => {
    let comp = a.dataDoFato.localeCompare(b.dataDoFato);
    if (comp != 0) {
      return comp;
    }
    return a.ehReceita && !b.ehReceita ? -1 : 0;
  });
  return copia;
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  const button = document.createElement("button");
  button.className = "btn-close fecha-lancamento";
  button.ariaLabel = "Close";
  parent.appendChild(button);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("fecha-lancamento");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = (ev) => {
      let div = ev.target.parentElement.parentElement;
      const idLancamento = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que deseja excluir este lançamento?")) {
        deleteItem(idLancamento, div)
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (idLancamento, div) => {
  console.log(idLancamento)
  let url = `${path}/lancamento/${idLancamento}/excluir`;
  let excluiu = false;
  fetch(url, {
    method: 'delete'
  })
    .then(() => {
      div.remove();
      alert(`Lançamento de id ${idLancamento} removido!`);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}



/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const tabelaOrcamento = document.getElementById('minhaTabela');
function insertList(lancamento) {
  let dataDoFato = new Date(lancamento.dataDoFato+' 00:00:00').toLocaleDateString();
  let item = [lancamento.id, dataDoFato, lancamento.descricao, lancamento.valor, lancamento.ehReceita, lancamento.subGrupo.descricao];
  let linha = tabelaOrcamento.insertRow();
  linha.className = lancamento.ehReceita ? 'table-success' : 'table-danger';

  for (let i = 0; i < item.length; i++) {
    let cel = linha.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(linha.insertCell(-1));
}

tabelaOrcamento.onchange = (ev) => {
  console.log(ev);
}

/*
  click no botão maisUm abre o modal. Aqui preenchemos o select dos grupos
*/
document.getElementById('maisUm').onclick = () => {
  let url = path + '/grupos';
  fetch(url, { method: 'GET' })
    .then((response) => response.json())
    .then((data) => {
      const selectGrupo = document.getElementById('select-grupo');
      data.grupos.forEach(grupo => insertOption(grupo, selectGrupo));
      selectGrupo.onchange = () => populaSubGrupos();
    })
}

/*
  Insere uma opção em um select. O objeto grupo tem que ter um id e uma descrição.
*/
const insertOption = (grupo, select) => {
  const option = document.createElement('option');
  option.textContent = grupo.descricao;
  option.value = grupo.id;
  select.appendChild(option);
}

/*
  Depois que escolher um grupo, vai popular os subgrupos.
*/
const populaSubGrupos = ()  => {
  const idGrupo = document.getElementById('select-grupo').value;
  const url = `${path}/grupo/${idGrupo}/sub-grupos`;
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      const selectSubGrupo = document.getElementById('select-subgrupo');
      selectSubGrupo.disabled = false;
      data.subGrupos.forEach(subgrupo => insertOption(subgrupo, selectSubGrupo));
    });
}


/*
  Cria um evento para o formulário de cadastro de Lançamento
*/
const form = document.getElementById('formCadastroLancamento');
form.onsubmit = (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    postLancamento(form['select-subgrupo'].value, form['dataDoFato'].value, form['descricao'].value, form['valorLancamento'].value, form['ehReceita'].checked);
  }
  form.classList.add('was-validated');
}

/*

*/
const postLancamento = (idSubGrupo, dataDoFato, descricao, valor, ehReceita) => {
  const formData = new FormData();
  formData.append('subGrupoId', idSubGrupo);
  formData.append('dataDoFato', dataDoFato);
  formData.append('descricao', descricao);
  formData.append('valor', valor);
  formData.append('ehReceita', ehReceita);

  const url = path + '/lancar';
  fetch(url, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => insertList(data.lancamento))
    .catch(error => console.error('Error: ', error));
}
