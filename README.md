# PSI

Da user story 2 é preciso verificar do lado do cliente se a page é valida para o currentWebsite.url


para correr no appServer:
- ssh PSI021@appserver.alunos.di.fc.ul.pt

- git pull (na pasta PSI)

- mongo --username psi021 --password --authenticationDatabase psi021
    appserver.alunos.di.fc.ul.pt/psi021

- ng serve --port 3021 --host 0.0.0.0 --disableHostCheck true (se der         Unknown argument trocar para isto -> --disable-host-check)

- node server.js


para correr abrir quatro terminais (o mongod e mongo tem de ser pela ordem):

/frontend ng serve

/backend node server.js

/PSI mongod 

/PSI mongo

Comados do mongo:
-show dbs (myapp é a nossa)

-use myapp (para escolher a base de dados)

-show collections (mostra as tabelas que existem?? acho eu)

-db.mycoll.find() (mostra os objetos na minha coleção)
-db.websites.find() (mostra os websites)

-db.mycolldeleteMany({}) para apagar todos
