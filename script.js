const path = 'http://127.0.0.1:5000';

let orcamento = [];
const tabelaOrcamento = document.getElementById('minhaTabela');
const form = document.getElementById('formCadastroLancamento');
/**
 * Função para obter o orçamento mensal ou anual
 * @param {number?} mes
 * @param {number?} ano
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
      orcamento = data.orcamento;
      const tbody = document.createElement('tbody');
      tabelaOrcamento.appendChild(tbody);
      carregaTabelaOrcamento(tbody);
      addEventoBotaoFechar();
    })
    .catch((error) => console.error('Error:', error));
}

getOrcamento();

/**
 * Carrega o orçamento dentro do elemento do DOM enviado
 * @param {HTMLTableSectionElement} tbody
 */
const carregaTabelaOrcamento = (tbody) => {
  ordenaOrcamento(orcamento)
    .map((lancamento, index, array) => {
      const parcela = lancamento.valor * (lancamento.ehReceita ? 1 : -1);
      if (!index) {
        lancamento.saldo = parcela;
      } else {
        const anterior = array[index - 1];
        lancamento.saldo = +(anterior.saldo + parcela).toFixed(2);
      }
      return lancamento;
    })
    .forEach(lancamento => insertList(lancamento, tbody));
}

/**
 * Ordena uma cópia do orçamento pela data e por receita/despesa (receita primeiro).
 * @param {any[]} orcamento lista de lançamentos
 * @returns Retorna esta cópia.
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


/**
  Função para criar um botão close
*/
const insertButton = (parent) => {
  const button = document.createElement("button");
  button.className = "btn-close fecha-lancamento";
  button.ariaLabel = "Close";
  parent.appendChild(button);
}


/**
 * Função para adicionar os eventos dos botões de exclusão do lançamento de cada linha da tabela
 */
const addEventoBotaoFechar = () => {
  let close = document.getElementsByClassName("fecha-lancamento");
  let i;
  for (i = 0; i < close.length; i++) {
    // cria um evento para click de cada botão close
    close[i].onclick = (ev) => {
      let div = ev.target.parentElement.parentElement;
      const idLancamento = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que deseja excluir este lançamento?")) {
        deleteItem(idLancamento)
      }
    }
  }
}

/**
 * Função para deletar um lançamento da lista do servidor via requisição DELETE
 * @param {number} idLancamento
 */
const deleteItem = (idLancamento) => {
  let url = `${path}/lancamento/${idLancamento}/excluir`;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => {
      if (response.status == '200') {
        orcamento = orcamento.filter(lancamento => lancamento.id != idLancamento);
        const tbody = document.createElement('tbody');
        carregaTabelaOrcamento(tbody);
        const oldTbody = tabelaOrcamento.lastChild;
        tabelaOrcamento.replaceChild(tbody, oldTbody);
        addEventoBotaoFechar();
        alert(`Lançamento de id ${idLancamento} removido!`);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}



/**
 * Função para inserir lancamento na tabela, onde cada lançamento se tornará uma linha
 * @param {*} lancamento
 * @param {HTMLTableSectionElement} tbody
 */
function insertList(lancamento, tbody) {
  let dataDoFato = new Date(lancamento.dataDoFato + ' 00:00:00').toLocaleDateString();
  let item = [lancamento.id, dataDoFato, lancamento.descricao, lancamento.valor, lancamento.ehReceita, lancamento.subGrupo.descricao, lancamento.saldo];
  let linha = tbody.insertRow();
  linha.className = lancamento.ehReceita ? 'table-success' : 'table-danger';

  let ultimaCel;
  item.forEach((item, index) => {
    const cel = linha.insertCell(index);
    cel.textContent = item;
    ultimaCel = cel;
  });
  ultimaCel.className = lancamento.saldo < 0 ? "text-danger" : "text-primary";

  insertButton(linha.insertCell(-1));
}

/**
  click no botão maisUm abre o modal. Aqui preenchemos o select dos grupos
*/
document.getElementById('maisUm').onclick = () => {
  let url = path + '/grupos';
  const selectGrupo = document.getElementById('select-grupo');
  if (selectGrupo.children.length == 1) {
    fetch(url, { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        data.grupos.forEach(grupo => selectGrupo.appendChild(createOption(grupo, selectGrupo)));
        selectGrupo.onchange = () => populaSubGrupos();
      });
  }
}

/**
 * Cria uma opção para um select.
 * @param {{id: number, descricao: string}} entidade tem que ter um id e uma descrição
 * @returns Opção criada no document
 */
const createOption = (entidade) => {
  const option = document.createElement('option');
  option.textContent = entidade.descricao;
  option.value = entidade.id;
  return option;
}

/**
 * Depois que escolher um grupo, vai popular os subgrupos.
 */
const populaSubGrupos = ()  => {
  const idGrupo = document.getElementById('select-grupo').value;
  const url = `${path}/grupo/${idGrupo}/sub-grupos`;
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      const selectSubGrupo = document.getElementById('select-subgrupo');
      selectSubGrupo.disabled = false;
      selectSubGrupo.replaceChildren([]);
      selectSubGrupo.appendChild(createOption({ id:'', descricao: 'Selecione um SubGrupo' }));
      data.subGrupos.map(subgrupo => selectSubGrupo.appendChild(createOption(subgrupo, selectSubGrupo)));
    });
}



/**
 * Cria um evento para o formulário de cadastro de Lançamento
 * @param {SubmitEvent} event
 */
form.onsubmit = (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    event.stopPropagation();
    form.classList.add('was-validated');
  } else {
    postLancamento(form['select-subgrupo'].value, form['dataDoFato'].value, form['descricao'].value, form['valorLancamento'].value, form['ehReceita'].checked);
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById("botalModalClose").click();
  }
}

/**
 * Insere um lançamento usando o método POST
 * @param {number} idSubGrupo
 * @param {string} dataDoFato
 * @param {string} descricao
 * @param {number} valor
 * @param {boolean} ehReceita
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
    .then(data => {
      orcamento.push(data);
      const tbody = document.createElement('tbody');
      carregaTabelaOrcamento(tbody);
      const oldTbody = tabelaOrcamento.lastChild;
      tabelaOrcamento.replaceChild(tbody, oldTbody);
      addEventoBotaoFechar();
    })
    .catch(error => console.error('Error: ', error));
}
