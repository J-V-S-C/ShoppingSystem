create table usuarios (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) not null,
    sobrenome varchar(255),
    email varchar(255) not null unique,
    senha varchar(255) not null
);

create table pedidos (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    data_compra DATETIME not null,
    valor_total float not null,
    usuario_id int not null,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


create table categorias (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) not null unique
);

create table itens (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    nome varchar(255) not null,
    descricao text,
    preco float not null,
    estoque int not null,
    categoria_id int,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

create table pedidos_itens (
    id int not null AUTO_INCREMENT PRIMARY KEY,
    pedido_id int,
    item_id int,
    quantidade int not null,
    valor_venda float not null,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (item_id) REFERENCES itens(id)
);