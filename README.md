# PSI

Da user story 2 é preciso verificar do lado do cliente se a page é valida para o currentWebsite.url

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
