ALTER TABLE order_products ADD CONSTRAINT unique_orderid_productid UNIQUE (order_id, product_id);