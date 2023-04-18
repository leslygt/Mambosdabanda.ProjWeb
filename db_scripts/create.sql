-- Create the database with the name: myproj
-- Then run the create table bellow


create table appuser
(
	usr_id SERIAL not null,
	usr_name VARCHAR(60),       	--nome do user
	usr_email VARCHAR(30),  		--email do user
	usr_pass CHAR(40),     		--palavra passe do user 
	usr_telefone char(12),    		--telefone do cliente
	usr_token VARCHAR (200)
	primary key (usr_id)
);

create table produto
(
	prod_id SERIAL not null,
	prod_nome VARCHAR(60), 		 --nome do produto
	prod_preco float,  			 --preço do produto 
	descricao VARCHAR (130),  	 --descrição do produto 
	quantidade float,  			 --quantidade do produto 
	primary key (prod_id)
);

create table loja
(
	loja_id SERIAL not null,
	loja_nome VARCHAR(60),			--nome da loja 
	loja_endereco VARCHAR(60),		--endereço da loja (cidade e rua)
	loja_cpostal char(9),	--código postal da loja 
	loja_telefone char(9),			--telefone da loja
	loja_pass CHAR(40),  
	loja_token VARCHAR (200),    --token da loja
	img_url character varying,
    latitude character varying,
    longitude character varying,
	primary key (loja_id)
);

create table lojaproduto
(
	lojaproduto_id SERIAL not null,
	loja_id_lp int not null, 		 --fk para loja
	prod_id_lp int not null, 	 --fk para produto
	primary key (lojaproduto_id)
);

CREATE TYPE estado_compra_enum AS ENUM ('Pendente', 'Processado');

create table compra
(
	compra_id SERIAL not null, 
	compra_data date,					--data de compra
	estado_compra estado_compra_enum,	--estado da compra onde apenas pode ser pendente ou processado
	loja_id_cmp int not null,			--fk para loja
	usr_id_cmp int not null,  			--fk para cliente
	primary key (compra_id)
);

create table lojaprodutocompra
(
	lojaprodutocompra_id SERIAL not null,
	lojaproduto_id_lpc integer not null, 	--fk para lojaproduto
	compra_id_lpc integer not null,  		--fk para compra
	primary key (lojaprodutocompra_id)
);


-- Foreign Keys

alter table lojaproduto 
add constraint lojaproduto_fk_loja
foreign key (loja_id_lp) references loja(loja_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table lojaproduto
add constraint lojaproduto_fk_produto
foreign key (prod_id_lp) references produto(prod_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table lojaprodutocompra 
add constraint lojaprodutocompra_fk_lojaproduto
foreign key (lojaproduto_id_lpc) references lojaproduto(lojaproduto_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table lojaprodutocompra 
add constraint lojaprodutocompra_fk_compra
foreign key (compra_id_lpc) references compra(compra_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table compra 
add constraint compra_fk_usr
foreign key (usr_id_cmp) references usr(usr_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

alter table compra 
add constraint compra_fk_loja
foreign key (loja_id_cmp) references loja(loja_id)
ON DELETE NO ACTION ON UPDATE NO ACTION;

