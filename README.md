# Orçamento Doméstico em React

Este é um Produto Mínimo Viável (MVP) utilizado como critério de pontuação para a disciplina Frontend Avançado do curso de Desenvolvimento Full Stack da PUC-RJ.

Trata-se de um front-end de um orçamento doméstico usando React.

Apresenta 3 telas principais:

- **ATUAL** - home page apresenta gastos do mês atual
- **HISTÓRICO** - apresenta 10 maiores gastos, a distribuição dos gastos por tipo e evolução dos gastos no tempo
- **FUTURO** - apresenta os objetivos

## Como executar o front em modo de desenvolvimento

Será necessário ter o NodeJs com npm instalado.

Após clonar o repositório, é necessário ir ao diretório raiz desse projeto pelo terminal para poder executar os comandos descritos abaixo.

```bash
npm install
```

Este comando instala as dependências/bibliotecas, descritas no arquivo `package.json`. Uma pasta chamada `node_modules` será criada.

Para executar a interface basta executar o comando:

```bash
npm start
```

Abra o [http://localhost:3000](http://localhost:3000) no navegador.

## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal e seus arquivos de aplicação e
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```shell
$ docker build -t orcamento-domestico-web .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```shell
$ docker run -dp 8080:80 orcamento-domestico-web
```

Uma vez executando, para acessar o front-end, basta abrir o [http://localhost:8080/#/](http://localhost:8080/#/) no navegador.
