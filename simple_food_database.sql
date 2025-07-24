-- Create the chinook database
CREATE DATABASE IF NOT EXISTS chinook;
USE chinook;

-- Create products table for food items
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample food products
INSERT INTO products (name, category, price, stock_quantity, image_url, description) VALUES
-- Beverages
('Coca Cola 2L', 'Beverages', 3.50, 25, 'https://example.com/coca-cola.jpg', 'Refreshing cola drink'),
('Pepsi 2L', 'Beverages', 2.30, 40, 'https://example.com/pepsi.jpg', 'Classic pepsi cola'),
('Orange Juice 1L', 'Beverages', 4.99, 15, 'https://example.com/orange-juice.jpg', 'Fresh orange juice'),
('Water Bottle 500ml', 'Beverages', 1.25, 100, 'https://example.com/water.jpg', 'Pure drinking water'),
('Green Tea', 'Beverages', 2.75, 30, 'https://example.com/green-tea.jpg', 'Healthy green tea'),

-- Dairy Products
('Milk 1L', 'Dairy', 2.99, 20, 'https://example.com/milk.jpg', 'Fresh whole milk'),
('Cheese Slices', 'Dairy', 5.49, 12, 'https://example.com/cheese.jpg', 'Processed cheese slices'),
('Butter 250g', 'Dairy', 4.25, 18, 'https://example.com/butter.jpg', 'Creamy butter'),
('Yogurt Plain', 'Dairy', 3.75, 22, 'https://example.com/yogurt.jpg', 'Natural plain yogurt'),

-- Fruits & Vegetables
('Bananas 1kg', 'Fruits', 2.50, 35, 'https://example.com/bananas.jpg', 'Fresh ripe bananas'),
('Apples 1kg', 'Fruits', 4.99, 28, 'https://example.com/apples.jpg', 'Crispy red apples'),
('Tomatoes 500g', 'Vegetables', 3.25, 20, 'https://example.com/tomatoes.jpg', 'Fresh tomatoes'),
('Onions 1kg', 'Vegetables', 2.75, 45, 'https://example.com/onions.jpg', 'Yellow cooking onions'),
('Carrots 500g', 'Vegetables', 2.99, 30, 'https://example.com/carrots.jpg', 'Fresh carrots'),

-- Bakery Items
('White Bread', 'Bakery', 2.50, 15, 'https://example.com/bread.jpg', 'Fresh white bread loaf'),
('Croissants 6pack', 'Bakery', 6.99, 8, 'https://example.com/croissants.jpg', 'Buttery croissants'),
('Bagels 4pack', 'Bakery', 4.50, 12, 'https://example.com/bagels.jpg', 'Fresh bagels'),

-- Meat & Poultry
('Chicken Breast 1kg', 'Meat', 12.99, 10, 'https://example.com/chicken.jpg', 'Fresh chicken breast'),
('Ground Beef 500g', 'Meat', 8.99, 15, 'https://example.com/beef.jpg', 'Fresh ground beef'),
('Salmon Fillet 500g', 'Seafood', 15.99, 8, 'https://example.com/salmon.jpg', 'Fresh salmon fillet'),

-- Pantry Items
('Rice 2kg', 'Pantry', 7.99, 25, 'https://example.com/rice.jpg', 'Long grain white rice'),
('Pasta 500g', 'Pantry', 3.49, 30, 'https://example.com/pasta.jpg', 'Italian pasta'),
('Olive Oil 500ml', 'Pantry', 8.99, 20, 'https://example.com/olive-oil.jpg', 'Extra virgin olive oil'),
('Salt 1kg', 'Pantry', 1.99, 50, 'https://example.com/salt.jpg', 'Table salt'),
('Sugar 1kg', 'Pantry', 3.25, 40, 'https://example.com/sugar.jpg', 'White granulated sugar'),

-- Snacks
('Chips 150g', 'Snacks', 3.99, 25, 'https://example.com/chips.jpg', 'Crispy potato chips'),
('Cookies 200g', 'Snacks', 4.25, 18, 'https://example.com/cookies.jpg', 'Chocolate chip cookies'),
('Nuts Mixed 250g', 'Snacks', 7.50, 15, 'https://example.com/nuts.jpg', 'Mixed nuts assortment'),

-- Frozen Items
('Ice Cream 1L', 'Frozen', 6.99, 12, 'https://example.com/ice-cream.jpg', 'Vanilla ice cream'),
('Frozen Pizza', 'Frozen', 5.99, 20, 'https://example.com/pizza.jpg', 'Margherita frozen pizza'),
('Frozen Vegetables 500g', 'Frozen', 4.49, 25, 'https://example.com/frozen-veg.jpg', 'Mixed frozen vegetables');

-- Create a simple categories table for reference
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Beverages', 'Drinks and liquid refreshments'),
('Dairy', 'Milk products and dairy items'),
('Fruits', 'Fresh fruits and fruit products'),
('Vegetables', 'Fresh vegetables and produce'),
('Bakery', 'Bread, pastries and baked goods'),
('Meat', 'Fresh meat and poultry'),
('Seafood', 'Fish and seafood products'),
('Pantry', 'Dry goods and cooking essentials'),
('Snacks', 'Snack foods and treats'),
('Frozen', 'Frozen food items');

-- Show the created tables and data
SELECT 'Products created:' as Status;
SELECT COUNT(*) as Total_Products FROM products;
SELECT category, COUNT(*) as Count FROM products GROUP BY category; 