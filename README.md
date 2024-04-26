# Orçamento Doméstico Web

Este é um **Produto Mínimo Viável (MVP)** utilizado como critério de pontuação para a disciplina **Desenvolvimento Back-end Avançado do curso de Desenvolvimento Full Stack da PUC-RJ**.

Trata-se de um front-end de um orçamento doméstico usando Reactjs.

Apresenta 3 telas principais:

- **ATUAL** - home page apresenta gastos do mês atual
- **HISTÓRICO** - apresenta a distribuição dos gastos
- **FUTURO** - apresenta os objetivos

[![Orçamento Doméstico](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbiAgc3ViZ3JhcGggRnJvbnRlbmRcbiAgICBXRUIoT3LDp2FtZW50byBEb23DqXN0aWNvIFdlYilcbiAgZW5kXG4gIHN1YmdyYXBoIEJhY2tlbmRcbiAgICBBUEkoT3LDp2FtZW50byBEb23DqXN0aWNvIC0gQVBJKVxuICAgIEdhdGV3YXkoRnJhc2VzIC0gQVBJKVxuICAgIEJEKEJhbmNvIGRlIERhZG9zIGVtIFNRTGl0ZSlcbiAgZW5kXG4gIHN1YmdyYXBoIEFQSXMgRXh0ZXJuYXNcbiAgICBHSihHZWVrLUpva2VzKSAgXG4gICAgUlVGKFJhbmRvbSBVc2VsZXNzIEZhY3RzKVxuICBlbmRcbiAgXG4gIFdFQi0tPkFQSVxuICBXRUItLT5HYXRld2F5XG4gIEdhdGV3YXktLS0tPkdKXG4gIEdhdGV3YXktLS0tPlJVRlxuICBBUEktLT5CRCIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://workflow.jace.pro/#/edit/eyJjb2RlIjoiZ3JhcGggVEJcbiAgc3ViZ3JhcGggRnJvbnRlbmRcbiAgICBXRUIoT3LDp2FtZW50byBEb23DqXN0aWNvIFdlYilcbiAgZW5kXG4gIHN1YmdyYXBoIEJhY2tlbmRcbiAgICBBUEkoT3LDp2FtZW50byBEb23DqXN0aWNvIC0gQVBJKVxuICAgIEdhdGV3YXkoRnJhc2VzIC0gQVBJKVxuICAgIEJEKEJhbmNvIGRlIERhZG9zIGVtIFNRTGl0ZSlcbiAgZW5kXG4gIHN1YmdyYXBoIEFQSXMgRXh0ZXJuYXNcbiAgICBHSihHZWVrLUpva2VzKSAgXG4gICAgUlVGKFJhbmRvbSBVc2VsZXNzIEZhY3RzKVxuICBlbmRcbiAgXG4gIFdFQi0tPkFQSVxuICBXRUItLT5HYXRld2F5XG4gIEdhdGV3YXktLS0tPkdKXG4gIEdhdGV3YXktLS0tPlJVRlxuICBBUEktLT5CRCIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

O Frontend se preocupa com a visualização dos dados. A lógica do negócio fica no projeto **Orçamento Doméstico - API**.

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
