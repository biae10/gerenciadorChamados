# Requisitos
- BackEnd em Spring Boot (Disponível em https://github.com/biae10/backEndGerenciaChamados )

- Http-Server para simular um servidor de imagens local

# Como instalar o projeto

Após clonar o projeto execute o seguinte comando dentro da pasta em que ele foi clonado:
### `npm install`

Em seguida, dentro da pasta do projeto, execute o seguinte comando:
### `npm start`

Esse comando vai fazer com que um servidor local seja iniciado com a aplicação.

## Configurando o serviço de imagens

Para o fluxo de upload de imagens funcionar localmente é preciso simular um servidor em nosso diretório de imagens. Para isso, você deve criar uma pasta em seu computador onde serão armazenadas as imagens do upload. A sugestão é criar uma pasta img dentro da pasta publics do próprio projeto.

Após isso é preciso entrar na pasta via terminal e executar o comando:

### `npm install -g http-server`

Em seguida (ainda dentro da pasta no terminal) execute o comando abaixo para iniciar o servidor:

### `http-server ./`

O servidor vai trazer essas informações ao ser iniciado.

![Servidor após ser iniciado](/public/server.png)

No campo "Available On" escolha um dos endereços disponíveis e coloque no lugar dos endereços presentes no src das tags <img> da page profile e do componente header.

## Configurando o backend

Após clonar o backend em Spring Boot importe o projeto em sua IDE de preferência (Recomendandos utilizar o eclipse). Em seguida, acesse o imagem controller e substitua o valor da variável endereço pelo caminho da pasta de imagens que foi criada anteriormente.

Execute a aplicação.

Feito isso o projeto já está pronto para uso.

# Sobre o projeto

O projeto é um gerenciador de chamados feito para a disciplina de programação web.
Ele possui os seguintes requisitos:
- Criação, edição e Login de usuários
- Upload de foto do usuário
- Crud de clientes
- Criação, edição e visualização de chamados.