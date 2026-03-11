-- Initial schema for Virtual Book Store
-- This migration is used for fresh databases.
-- For existing databases, baseline-on-migrate=true marks V1 as already applied.

CREATE TABLE IF NOT EXISTS `user` (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    role VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL,
    CONSTRAINT pk_user PRIMARY KEY (id),
    CONSTRAINT uk_user_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NULL,
    author VARCHAR(255) NULL,
    price DOUBLE NOT NULL,
    category VARCHAR(255) NULL,
    description LONGTEXT NULL,
    stock INT NOT NULL,
    CONSTRAINT pk_book PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS cart (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NULL,
    CONSTRAINT pk_cart PRIMARY KEY (id),
    CONSTRAINT uk_cart_user UNIQUE (user_id),
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES `user` (id)
);

CREATE TABLE IF NOT EXISTS cart_item (
    id BIGINT NOT NULL AUTO_INCREMENT,
    quantity INT NOT NULL,
    book_id BIGINT NULL,
    cart_id BIGINT NULL,
    CONSTRAINT pk_cart_item PRIMARY KEY (id),
    CONSTRAINT fk_cart_item_book FOREIGN KEY (book_id) REFERENCES book (id),
    CONSTRAINT fk_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart (id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT NOT NULL AUTO_INCREMENT,
    total_cost DOUBLE NOT NULL,
    order_date DATETIME(6) NULL,
    status VARCHAR(255) NULL,
    user_id BIGINT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES `user` (id)
);

CREATE TABLE IF NOT EXISTS order_item (
    id BIGINT NOT NULL AUTO_INCREMENT,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    book_id BIGINT NULL,
    order_id BIGINT NULL,
    CONSTRAINT pk_order_item PRIMARY KEY (id),
    CONSTRAINT fk_order_item_book FOREIGN KEY (book_id) REFERENCES book (id),
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders (id)
);
