# MVP Arquitetura de Software

Links:
  - API: https://pokeapi.co/  ou   https://pokeapi.co/api/v2/
  - Youtube: https://youtu.be/jCsrYVIBv9I

Esse repositório é para a entrega do MVP da Disciplina Aruitetura de Software

No projeto foi solicitado a criação de um sistema Web Fullstack onde seria necessário a chamada de uma API externa, nesse projeto tbm foram dadas alternativas para a sua execução.
Para o meu projeto foi escolhido o cenário onde teria um front-end, um back-end e a solicitação da API externa, conforme a figura abaixo:

![image](https://github.com/user-attachments/assets/d37ad35a-ba17-4b81-8cd3-be73246db989)

A ideia da aplicação seria retirar alguns dados dos Pokemon vindo da API, colocar como um mostruario na parte superior da página onde o usuário pudesse escolher qual ele iria "capturar" (POST) e enviar para sua PokeDeck.
Na parte inferior da tela seria possivel ver a PokeDeck do usuário (GET) e no card de cada Pokemon era possivel remover o Pokemon da sua PokeDeck (REMOVE).

![image](https://github.com/user-attachments/assets/61f2c542-4d42-46af-841c-7ca53b2227a6)

A API Externa foi trabalhada e manejada no arquivo poke-api.ts onde é possivel ver os parametros que foram trabalhados na aplicação
![image](https://github.com/user-attachments/assets/3afdfa41-31d7-4379-bec8-ed43c8269e3e)

Para a API local foram feitos os metodos correspondentens e exibidos dentro do Swagger para facilitar a análise.
Mostrando modelo, esquema e os exemplos

![image](https://github.com/user-attachments/assets/0b929c1d-a24e-4d2c-b503-341ef24be1e2)

Portando foram feitas as integrações necessárias para que o Pokemon fosse capturado (Metodos Get/Post/Remove)

![image](https://github.com/user-attachments/assets/a12ec262-6134-4d1f-8dfb-97d79132adbc)


# Execução API local

### Instalação


Será necessário ter todas as libs python listadas no `requirements.txt` instaladas.
Após clonar o repositório, é necessário ir ao diretório raiz, pelo terminal, para poder executar os comandos descritos abaixo.

> É fortemente indicado o uso de ambientes virtuais do tipo [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).

```
(env)$ pip install -r requirements.txt
```

Este comando instala as dependências/bibliotecas, descritas no arquivo `requirements.txt`.

---
### Executando o servidor


Para executar a API  basta executar:

```
(env)$ flask run --reload
```

---
### Acesso no browser

Abra o [http://localhost:5000/#/](http://localhost:5000/#/) no navegador para verificar o status da API em execução.

---
## Como executar através do Docker

Certifique-se de ter o [Docker](https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile e o requirements.txt no terminal.
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t rest-api .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, seguinte o comando:

```
$ docker run -p 5000:5000 rest-api
```

Uma vez executando, para acessar a API, basta abrir o [http://localhost:5000/#/](http://localhost:5000/#/) no navegador.

# Execução Front-End

### Instalação


Será necessário o npm para conseguir executar a aplicação.
```
$ npm install
```

---
### Executando o servidor


Para executar o Front-end basta executar:

```
$ npm run dev 
```

---
### Acesso no browser

Abra o [[http://localhost:9002/](http://localhost:9002)] no navegador para verificar I em execução.

---
![image](https://github.com/user-attachments/assets/698ecb75-ac3d-4574-83b3-c17535b3fe47)
