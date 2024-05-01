
# WhatsApp e Microsoft Teams Integration via Power Automate

Este projeto implementa uma integração entre o WhatsApp e o Microsoft Teams, utilizando o Power Automate para orquestrar as mensagens entre as duas plataformas.

## Descrição

O servidor Node.js utiliza o `whatsapp-web.js` para interagir com o WhatsApp e o `axios` para enviar requisições para o Power Automate, que então comunica-se com o Microsoft Teams. As mensagens são armazenadas em um banco de dados MongoDB, permitindo acesso ao histórico de conversas.

## Tecnologias Utilizadas

- Node.js
- Express
- WhatsApp Web.js
- Mongoose
- MongoDB
- Axios
- Docker

## Setup do Projeto

### Pré-Requisitos

- Docker e Docker Compose instalados.
- Node.js instalado.
- Uma instância do MongoDB.
- Configuração de um endpoint do Power Automate que possa receber e enviar mensagens para o Microsoft Teams.

### Instalação

1. Clone o repositório.
2. Configure as variáveis de ambiente no arquivo `.env` conforme necessário.
3. Construa e execute o projeto usando Docker Compose:

```bash
docker-compose up --build
```

## Configuração

Edite o arquivo `.env` para ajustar as seguintes variáveis:

```plaintext
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=secret
POWER_AUTOMATE_URL=http://example.com/api
APP_PORT=3000
```

## Uso

Envie requisições HTTP POST para `/recebeMensagem` para simular a recepção de mensagens do WhatsApp, e para `/resposta` para enviar respostas do Teams para o WhatsApp.

### Endpoints

- `POST /recebeMensagem`: Recebe mensagens do WhatsApp, salva no banco de dados e envia para o Power Automate.
- `POST /resposta`: Recebe mensagens do Power Automate e envia de volta ao WhatsApp.

## Contribuições

Contribuições são bem-vindas! Para contribuir, por favor, faça um fork do repositório, crie uma branch para suas alterações e envie um pull request.

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
