-- V2: Seed categories, brands, and books
-- Users are created by DataInitializer on startup

-- Categories
INSERT INTO categories (name, description, image_url)
SELECT 'Fiction', 'Novels, short stories, and imaginative works', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Fiction');

INSERT INTO categories (name, description, image_url)
SELECT 'Technology', 'Programming, software engineering, and tech topics', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Technology');

INSERT INTO categories (name, description, image_url)
SELECT 'Science', 'Physics, biology, chemistry, and natural sciences', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Science');

INSERT INTO categories (name, description, image_url)
SELECT 'History', 'World history, biographies, and historical events', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'History');

INSERT INTO categories (name, description, image_url)
SELECT 'Self-Help', 'Personal development, productivity, and wellness', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Self-Help');

-- Brands (Publishers)
INSERT INTO brands (name, description, logo_url)
SELECT 'Penguin Books', 'One of the world''s most recognizable publishing houses', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Penguin Books');

INSERT INTO brands (name, description, logo_url)
SELECT 'O''Reilly Media', 'Leading publisher of technology and programming books', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'O''Reilly Media');

INSERT INTO brands (name, description, logo_url)
SELECT 'Random House', 'Publisher of award-winning fiction and non-fiction', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Random House');

INSERT INTO brands (name, description, logo_url)
SELECT 'HarperCollins', 'Global publisher with a rich literary tradition', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'HarperCollins');

-- Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Great Gatsby', 'F. Scott Fitzgerald',
    'A classic novel set in the Jazz Age, exploring themes of wealth, class, and the American Dream.',
    12.99, 50, '978-0743273565', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    1925, TRUE,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM brands WHERE name = 'Penguin Books'), 245
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0743273565');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'To Kill a Mockingbird', 'Harper Lee',
    'A gripping tale of racial injustice and loss of innocence in the American South.',
    14.99, 35, '978-0061935466', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    1960, TRUE,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM brands WHERE name = 'HarperCollins'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0061935466');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT '1984', 'George Orwell',
    'A dystopian novel about a totalitarian society where Big Brother controls every aspect of life.',
    11.99, 60, '978-0451524935', 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400',
    1949, TRUE,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM brands WHERE name = 'Penguin Books'), 428
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0451524935');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams',
    'A comedic science fiction series following Arthur Dent after Earth is demolished.',
    13.99, 40, '978-0345391803', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400',
    1979, TRUE,
    (SELECT id FROM categories WHERE name = 'Fiction'),
    (SELECT id FROM brands WHERE name = 'Random House'), 189
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0345391803');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Clean Code', 'Robert C. Martin',
    'A handbook of agile software craftsmanship. Learn how to write clean, maintainable code.',
    39.99, 25, '978-0132350884', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    2008, TRUE,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 567
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0132350884');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt',
    'A guide to becoming a better programmer with practical advice from seasoned experts.',
    44.99, 20, '978-0135957059', 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=400',
    2019, TRUE,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 493
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0135957059');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Designing Data-Intensive Applications', 'Martin Kleppmann',
    'A deep dive into principles for building reliable, scalable, and maintainable systems.',
    54.99, 15, '978-1449373320', 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=400',
    2017, TRUE,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 378
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1449373320');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Spring Boot in Action', 'Craig Walls',
    'A practical guide to the Spring Boot framework for building production-ready Java applications quickly.',
    49.99, 30, '978-1617292545', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    2019, TRUE,
    (SELECT id FROM categories WHERE name = 'Technology'),
    (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 221
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1617292545');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'A Brief History of Time', 'Stephen Hawking',
    'An exploration of cosmology, time, and the universe origins written for general audiences.',
    15.99, 45, '978-0553380163', 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400',
    1988, TRUE,
    (SELECT id FROM categories WHERE name = 'Science'),
    (SELECT id FROM brands WHERE name = 'Penguin Books'), 634
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0553380163');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Selfish Gene', 'Richard Dawkins',
    'A groundbreaking work on evolutionary biology introducing the gene-centered view of evolution.',
    16.99, 30, '978-0198788607', 'https://images.unsplash.com/photo-1532094349884-543559ac1e63?w=400',
    1976, TRUE,
    (SELECT id FROM categories WHERE name = 'Science'),
    (SELECT id FROM brands WHERE name = 'Penguin Books'), 287
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0198788607');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Cosmos', 'Carl Sagan',
    'A journey through the universe connecting scientific knowledge with its human context.',
    18.99, 25, '978-0345539434', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400',
    1980, TRUE,
    (SELECT id FROM categories WHERE name = 'Science'),
    (SELECT id FROM brands WHERE name = 'Random House'), 345
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0345539434');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari',
    'From the cognitive revolution to the modern era, a sweeping narrative of human history.',
    19.99, 55, '978-0062316110', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    2011, TRUE,
    (SELECT id FROM categories WHERE name = 'History'),
    (SELECT id FROM brands WHERE name = 'HarperCollins'), 712
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062316110');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Guns, Germs, and Steel', 'Jared Diamond',
    'An examination of why some civilizations came to dominate others through geography and biology.',
    17.99, 40, '978-0393354324', 'https://images.unsplash.com/photo-1552308995-2baac1ad5490?w=400',
    1997, TRUE,
    (SELECT id FROM categories WHERE name = 'History'),
    (SELECT id FROM brands WHERE name = 'Random House'), 289
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0393354324');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Atomic Habits', 'James Clear',
    'A proven framework for building good habits and breaking bad ones through small incremental changes.',
    24.99, 65, '978-0735211292', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400',
    2018, TRUE,
    (SELECT id FROM categories WHERE name = 'Self-Help'),
    (SELECT id FROM brands WHERE name = 'Random House'), 891
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0735211292');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The 7 Habits of Highly Effective People', 'Stephen R. Covey',
    'A principle-centered approach to solving personal and professional challenges.',
    21.99, 50, '978-1982137274', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
    1989, TRUE,
    (SELECT id FROM categories WHERE name = 'Self-Help'),
    (SELECT id FROM brands WHERE name = 'HarperCollins'), 456
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1982137274');
