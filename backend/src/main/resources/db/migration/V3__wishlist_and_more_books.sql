-- V3: Add wishlist table, more categories, brands, and 100+ books with Open Library covers

-- ============================================================
-- WISHLIST TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_book ON wishlists(book_id);

-- ============================================================
-- UPDATE EXISTING BOOKS to use Open Library cover images
-- ============================================================
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg' WHERE isbn = '978-0743273565';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780061935466-L.jpg' WHERE isbn = '978-0061935466';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' WHERE isbn = '978-0451524935';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg' WHERE isbn = '978-0345391803';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg' WHERE isbn = '978-0132350884';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg' WHERE isbn = '978-0135957059';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg' WHERE isbn = '978-1449373320';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg' WHERE isbn = '978-1617292545';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg' WHERE isbn = '978-0553380163';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg' WHERE isbn = '978-0198788607';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg' WHERE isbn = '978-0345539434';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780062316110-L.jpg' WHERE isbn = '978-0062316110';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780393354324-L.jpg' WHERE isbn = '978-0393354324';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' WHERE isbn = '978-0735211292';
UPDATE books SET image_url = 'https://covers.openlibrary.org/b/isbn/9781982137274-L.jpg' WHERE isbn = '978-1982137274';

-- ============================================================
-- MORE CATEGORIES
-- ============================================================
INSERT INTO categories (name, description, image_url)
SELECT 'Business', 'Entrepreneurship, management, and finance books', 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Business');

INSERT INTO categories (name, description, image_url)
SELECT 'Philosophy', 'Ethics, metaphysics, and classic philosophical works', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Philosophy');

INSERT INTO categories (name, description, image_url)
SELECT 'Fantasy', 'Epic fantasy, magic systems, and mythological adventures', 'https://images.unsplash.com/photo-1598618589929-b1433d05cfc6?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Fantasy');

INSERT INTO categories (name, description, image_url)
SELECT 'Mystery', 'Crime fiction, thrillers, and detective novels', 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Mystery');

INSERT INTO categories (name, description, image_url)
SELECT 'Biography', 'Memoirs, autobiographies, and life stories', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Biography');

-- ============================================================
-- MORE PUBLISHERS / BRANDS
-- ============================================================
INSERT INTO brands (name, description, logo_url)
SELECT 'Scribner', 'Prestigious imprint of Simon & Schuster publishing literary fiction', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Scribner');

INSERT INTO brands (name, description, logo_url)
SELECT 'Simon & Schuster', 'One of the Big Five publishing houses with global reach', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Simon & Schuster');

INSERT INTO brands (name, description, logo_url)
SELECT 'Vintage Books', 'Quality paperback imprint of Knopf Doubleday Group', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Vintage Books');

INSERT INTO brands (name, description, logo_url)
SELECT 'No Starch Press', 'Publisher of technical books with a unique personality', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'No Starch Press');

INSERT INTO brands (name, description, logo_url)
SELECT 'Tor Books', 'Leading science fiction and fantasy publisher', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Tor Books');

INSERT INTO brands (name, description, logo_url)
SELECT 'Mariner Books', 'Houghton Mifflin imprint for quality literary reprints', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Mariner Books');

INSERT INTO brands (name, description, logo_url)
SELECT 'W. W. Norton', 'The largest and oldest employee-owned US book publisher', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'W. W. Norton');

INSERT INTO brands (name, description, logo_url)
SELECT 'Crown Publishers', 'Imprint of Penguin Random House focusing on popular titles', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200'
WHERE NOT EXISTS (SELECT 1 FROM brands WHERE name = 'Crown Publishers');

-- ============================================================
-- FICTION BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Pride and Prejudice', 'Jane Austen',
    'A witty romantic novel exploring social class and marriage in Regency-era England.',
    9.99, 80, '978-0141439518', 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    1813, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 567
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0141439518');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Catcher in the Rye', 'J. D. Salinger',
    'A story of teenage alienation and loss of innocence told by the unforgettable Holden Caulfield.',
    13.99, 45, '978-0316769174', 'https://covers.openlibrary.org/b/isbn/9780316769174-L.jpg',
    1951, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Scribner'), 389
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0316769174');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Brave New World', 'Aldous Huxley',
    'A dystopian vision of a future society controlled through pleasure and genetic engineering.',
    12.99, 55, '978-0060850524', 'https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg',
    1932, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 412
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0060850524');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Lord of the Flies', 'William Golding',
    'British schoolboys stranded on a desert island descend into savagery in this allegorical novel.',
    11.99, 40, '978-0399501487', 'https://covers.openlibrary.org/b/isbn/9780399501487-L.jpg',
    1954, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 298
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0399501487');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Animal Farm', 'George Orwell',
    'A political allegory using farm animals to satirize the events leading up to the Russian Revolution.',
    9.99, 65, '978-0451526342', 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg',
    1945, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 445
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0451526342');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Fahrenheit 451', 'Ray Bradbury',
    'In a future society where books are banned and burned, a fireman begins to question his role.',
    12.99, 50, '978-1451673319', 'https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg',
    1953, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Simon & Schuster'), 334
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1451673319');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Alchemist', 'Paulo Coelho',
    'A philosophical novel about Santiago, an Andalusian shepherd boy, who dreams of finding treasure.',
    14.99, 70, '978-0062315007', 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    1988, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 678
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062315007');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'One Hundred Years of Solitude', 'Gabriel García Márquez',
    'The multi-generational story of the Buendía family in the fictional town of Macondo.',
    16.99, 35, '978-0060883287', 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
    1967, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 356
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0060883287');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Crime and Punishment', 'Fyodor Dostoevsky',
    'A psychological thriller following a student who commits a murder and struggles with guilt and redemption.',
    14.99, 30, '978-0143058144', 'https://covers.openlibrary.org/b/isbn/9780143058144-L.jpg',
    1866, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 267
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0143058144');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Count of Monte Cristo', 'Alexandre Dumas',
    'An adventure novel following Edmond Dantès, wrongly imprisoned, who escapes and seeks revenge.',
    19.99, 25, '978-0140449266', 'https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg',
    1844, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 234
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0140449266');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Moby Dick', 'Herman Melville',
    'Captain Ahab obsessively pursues the white sperm whale across the seas in this American epic.',
    13.99, 20, '978-0142437247', 'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
    1851, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 189
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0142437247');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Picture of Dorian Gray', 'Oscar Wilde',
    'A gothic tale of vanity, corruption, and moral decay as a beautiful man remains perpetually young.',
    11.99, 40, '978-0141439570', 'https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg',
    1890, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0141439570');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Dune', 'Frank Herbert',
    'An epic science fiction saga set on the desert planet Arrakis, exploring power, religion, and ecology.',
    17.99, 60, '978-0441013593', 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg',
    1965, TRUE, (SELECT id FROM categories WHERE name = 'Fiction'), (SELECT id FROM brands WHERE name = 'Scribner'), 589
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0441013593');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Da Vinci Code', 'Dan Brown',
    'A gripping thriller involving religious conspiracy, secret societies, and hidden codes in art.',
    15.99, 55, '978-0307474278', 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    2003, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 723
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0307474278');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Gone Girl', 'Gillian Flynn',
    'A psychological thriller about a man suspected of murdering his wife on their fifth anniversary.',
    14.99, 45, '978-0307588371', 'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
    2012, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'Crown Publishers'), 612
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0307588371');

-- ============================================================
-- FANTASY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Lord of the Rings', 'J. R. R. Tolkien',
    'The definitive epic fantasy follows the fellowship to destroy the One Ring and defeat Sauron.',
    24.99, 75, '978-0618640157', 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg',
    1954, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Mariner Books'), 934
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0618640157');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Harry Potter and the Sorcerer''s Stone', 'J. K. Rowling',
    'An orphan boy discovers he is a wizard and enters the magical world of Hogwarts School.',
    14.99, 100, '978-0439708180', 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
    1997, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Scribner'), 1245
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0439708180');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'A Game of Thrones', 'George R. R. Martin',
    'Noble families fight for control of Westeros in this brutal and complex fantasy epic.',
    18.99, 65, '978-0553573404', 'https://covers.openlibrary.org/b/isbn/9780553573404-L.jpg',
    1996, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 812
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0553573404');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Name of the Wind', 'Patrick Rothfuss',
    'The legendary Kvothe tells the story of his remarkable life — his triumphs and his failures.',
    16.99, 50, '978-0756404079', 'https://covers.openlibrary.org/b/isbn/9780756404079-L.jpg',
    2007, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Tor Books'), 534
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0756404079');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Ender''s Game', 'Orson Scott Card',
    'A gifted child is recruited to a military training program to prepare Earth for an alien invasion.',
    13.99, 55, '978-0812550702', 'https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg',
    1985, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Tor Books'), 467
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0812550702');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Hunger Games', 'Suzanne Collins',
    'In a dystopian future, teenagers are chosen to fight to the death in an annual televised event.',
    12.99, 80, '978-0439023481', 'https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg',
    2008, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'Scribner'), 978
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0439023481');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'American Gods', 'Neil Gaiman',
    'A man released from prison becomes involved in a conflict between old gods and new ones.',
    15.99, 40, '978-0062572233', 'https://covers.openlibrary.org/b/isbn/9780062572233-L.jpg',
    2001, TRUE, (SELECT id FROM categories WHERE name = 'Fantasy'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 389
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062572233');

-- ============================================================
-- TECHNOLOGY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'JavaScript: The Good Parts', 'Douglas Crockford',
    'An expert guide to the good parts of JavaScript, the world''s most popular programming language.',
    34.99, 30, '978-0596517748', 'https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg',
    2008, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 412
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0596517748');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Python Crash Course', 'Eric Matthes',
    'A hands-on, project-based introduction to Python for beginners and aspiring programmers.',
    39.99, 40, '978-1593279288', 'https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg',
    2019, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'No Starch Press'), 534
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1593279288');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Eloquent JavaScript', 'Marijn Haverbeke',
    'A modern introduction to programming and JavaScript with a focus on understanding.',
    29.99, 35, '978-1593279509', 'https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg',
    2018, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'No Starch Press'), 289
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1593279509');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Introduction to Algorithms', 'Thomas H. Cormen et al.',
    'The definitive textbook on algorithms, covering design, analysis, and implementation.',
    74.99, 20, '978-0262033848', 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg',
    2009, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'No Starch Press'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0262033848');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Design Patterns', 'Gang of Four',
    'The classic catalog of 23 object-oriented design patterns that every software engineer must know.',
    59.99, 25, '978-0201633610', 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg',
    1994, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 389
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0201633610');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Code Complete', 'Steve McConnell',
    'A comprehensive handbook of software construction covering coding practices and techniques.',
    54.99, 20, '978-0735619678', 'https://covers.openlibrary.org/b/isbn/9780735619678-L.jpg',
    2004, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 267
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0735619678');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Refactoring', 'Martin Fowler',
    'A guide to improving the design of existing code through disciplined refactoring techniques.',
    49.99, 25, '978-0134757599', 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg',
    2018, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0134757599');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Cracking the Coding Interview', 'Gayle Laakmann McDowell',
    '189 programming questions and solutions for technical interviews at top tech companies.',
    44.99, 50, '978-0984782857', 'https://covers.openlibrary.org/b/isbn/9780984782857-L.jpg',
    2015, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'No Starch Press'), 678
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0984782857');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Art of Computer Programming', 'Donald E. Knuth',
    'The definitive multi-volume work on fundamental algorithms by a computer science legend.',
    179.99, 10, '978-0201853926', 'https://covers.openlibrary.org/b/isbn/9780201853926-L.jpg',
    1968, TRUE, (SELECT id FROM categories WHERE name = 'Technology'), (SELECT id FROM brands WHERE name = 'O''Reilly Media'), 145
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0201853926');

-- ============================================================
-- SCIENCE BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Origin of Species', 'Charles Darwin',
    'The foundational work of evolutionary biology introducing the theory of natural selection.',
    11.99, 35, '978-0451529060', 'https://covers.openlibrary.org/b/isbn/9780451529060-L.jpg',
    1859, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 234
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0451529060');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Surely You''re Joking, Mr. Feynman!', 'Richard P. Feynman',
    'Adventures of a curious character — memoir of Nobel-winning physicist Richard Feynman.',
    17.99, 40, '978-0393316049', 'https://covers.openlibrary.org/b/isbn/9780393316049-L.jpg',
    1985, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'W. W. Norton'), 456
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0393316049');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Astrophysics for People in a Hurry', 'Neil deGrasse Tyson',
    'A brisk tour through the major ideas of the universe for time-pressed readers.',
    16.99, 55, '978-0393609394', 'https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg',
    2017, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'W. W. Norton'), 534
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0393609394');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Why We Sleep', 'Matthew Walker',
    'Unlocking the power of sleep and dreams — a revolutionary exploration of sleep science.',
    18.99, 45, '978-1501144318', 'https://covers.openlibrary.org/b/isbn/9781501144318-L.jpg',
    2017, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'Scribner'), 612
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1501144318');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Sixth Extinction', 'Elizabeth Kolbert',
    'A Pulitzer Prize-winning account of Earth''s current mass extinction driven by human activity.',
    17.99, 30, '978-1250062185', 'https://covers.openlibrary.org/b/isbn/9781250062185-L.jpg',
    2014, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'Mariner Books'), 289
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1250062185');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Gene: An Intimate History', 'Siddhartha Mukherjee',
    'A riveting account of the history, present state, and future of the science of heredity.',
    19.99, 25, '978-1476733524', 'https://covers.openlibrary.org/b/isbn/9781476733524-L.jpg',
    2016, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'Scribner'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1476733524');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Grand Design', 'Stephen Hawking & Leonard Mlodinow',
    'New answers to the ultimate questions of life, the universe, and reality itself.',
    16.99, 35, '978-0553384666', 'https://covers.openlibrary.org/b/isbn/9780553384666-L.jpg',
    2010, TRUE, (SELECT id FROM categories WHERE name = 'Science'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 234
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0553384666');

-- ============================================================
-- HISTORY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Diary of a Young Girl', 'Anne Frank',
    'The moving journal of a Jewish girl who hid from the Nazis for two years during World War II.',
    12.99, 60, '978-0553577129', 'https://covers.openlibrary.org/b/isbn/9780553577129-L.jpg',
    1947, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 789
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0553577129');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Team of Rivals', 'Doris Kearns Goodwin',
    'The political genius of Abraham Lincoln, exploring how he united his rivals into his cabinet.',
    19.99, 30, '978-0743270755', 'https://covers.openlibrary.org/b/isbn/9780743270755-L.jpg',
    2005, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'Simon & Schuster'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0743270755');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Homo Deus: A Brief History of Tomorrow', 'Yuval Noah Harari',
    'What will be the future of humanity? Harari examines what humans might become in the next century.',
    21.99, 45, '978-0062464316', 'https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg',
    2015, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 523
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062464316');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT '21 Lessons for the 21st Century', 'Yuval Noah Harari',
    'What are the most important challenges and choices we face today? A guide to the most pressing issues.',
    20.99, 40, '978-0525512172', 'https://covers.openlibrary.org/b/isbn/9780525512172-L.jpg',
    2018, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 412
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0525512172');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Art of War', 'Sun Tzu',
    'An ancient Chinese military treatise with timeless wisdom applicable to strategy and leadership.',
    9.99, 85, '978-0140455526', 'https://covers.openlibrary.org/b/isbn/9780140455526-L.jpg',
    -500, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 456
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0140455526');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'SPQR: A History of Ancient Rome', 'Mary Beard',
    'An authoritative, original and accessible history of Rome from one of the foremost classicists.',
    18.99, 25, '978-1631491252', 'https://covers.openlibrary.org/b/isbn/9781631491252-L.jpg',
    2015, TRUE, (SELECT id FROM categories WHERE name = 'History'), (SELECT id FROM brands WHERE name = 'W. W. Norton'), 234
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1631491252');

-- ============================================================
-- SELF-HELP BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Man''s Search for Meaning', 'Viktor E. Frankl',
    'A psychiatrist''s memoir of surviving Nazi death camps and his resulting logotherapy approach.',
    13.99, 55, '978-0807014271', 'https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg',
    1946, TRUE, (SELECT id FROM categories WHERE name = 'Self-Help'), (SELECT id FROM brands WHERE name = 'Mariner Books'), 623
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0807014271');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'How to Win Friends and Influence People', 'Dale Carnegie',
    'The classic bestseller of practical advice on human relations and social success.',
    14.99, 65, '978-0671027032', 'https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg',
    1936, TRUE, (SELECT id FROM categories WHERE name = 'Self-Help'), (SELECT id FROM brands WHERE name = 'Simon & Schuster'), 734
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0671027032');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Think and Grow Rich', 'Napoleon Hill',
    'Drawing lessons from more than 500 successful people to show how to translate desire into success.',
    13.99, 50, '978-1585424337', 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg',
    1937, TRUE, (SELECT id FROM categories WHERE name = 'Self-Help'), (SELECT id FROM brands WHERE name = 'Mariner Books'), 589
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1585424337');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Rich Dad Poor Dad', 'Robert T. Kiyosaki',
    'What the rich teach their kids about money that the poor and middle class do not.',
    16.99, 60, '978-1612680194', 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
    1997, TRUE, (SELECT id FROM categories WHERE name = 'Self-Help'), (SELECT id FROM brands WHERE name = 'Scribner'), 812
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1612680194');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Power of Now', 'Eckhart Tolle',
    'A guide to spiritual enlightenment focusing on living in the present moment.',
    15.99, 45, '978-1577314806', 'https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg',
    1997, TRUE, (SELECT id FROM categories WHERE name = 'Self-Help'), (SELECT id FROM brands WHERE name = 'Mariner Books'), 445
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1577314806');

-- ============================================================
-- BUSINESS BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Good to Great', 'Jim Collins',
    'Why some companies make the leap from good to great and others don''t.',
    24.99, 35, '978-0066620992', 'https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg',
    2001, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 412
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0066620992');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Zero to One', 'Peter Thiel',
    'Notes on startups, or how to build the future. Insights from one of Silicon Valley''s best investors.',
    22.99, 45, '978-0804139021', 'https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg',
    2014, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'Crown Publishers'), 534
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0804139021');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Lean Startup', 'Eric Ries',
    'How today''s entrepreneurs use continuous innovation to create radically successful businesses.',
    24.99, 40, '978-0307887894', 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
    2011, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'Crown Publishers'), 467
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0307887894');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Thinking, Fast and Slow', 'Daniel Kahneman',
    'A Nobel laureate examines two systems of thought — fast/intuitive and slow/deliberate thinking.',
    19.99, 50, '978-0374533557', 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
    2011, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 678
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0374533557');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Outliers: The Story of Success', 'Malcolm Gladwell',
    'Why do some people succeed far more than others? Gladwell examines the roots of achievement.',
    18.99, 55, '978-0316017930', 'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg',
    2008, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'Scribner'), 589
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0316017930');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Innovator''s Dilemma', 'Clayton M. Christensen',
    'The revolutionary book that will forever change how you do business about disruptive innovation.',
    26.99, 25, '978-0062060242', 'https://covers.openlibrary.org/b/isbn/9780062060242-L.jpg',
    1997, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 312
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062060242');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Tipping Point', 'Malcolm Gladwell',
    'How little things can make a big difference — the magic moment when an idea crosses a threshold.',
    17.99, 40, '978-0316316965', 'https://covers.openlibrary.org/b/isbn/9780316316965-L.jpg',
    2000, TRUE, (SELECT id FROM categories WHERE name = 'Business'), (SELECT id FROM brands WHERE name = 'Scribner'), 423
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0316316965');

-- ============================================================
-- PHILOSOPHY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Meditations', 'Marcus Aurelius',
    'Personal writings of the Roman emperor, a series of Stoic reflections on duty, life, and death.',
    11.99, 55, '978-0812968255', 'https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg',
    180, TRUE, (SELECT id FROM categories WHERE name = 'Philosophy'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 456
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0812968255');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Republic', 'Plato',
    'Plato''s vision of an ideal state and the nature of justice, knowledge, and the philosopher-king.',
    12.99, 40, '978-0872201361', 'https://covers.openlibrary.org/b/isbn/9780872201361-L.jpg',
    -380, TRUE, (SELECT id FROM categories WHERE name = 'Philosophy'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 234
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0872201361');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Thus Spoke Zarathustra', 'Friedrich Nietzsche',
    'Nietzsche''s philosophical novel presenting his concepts of Übermensch and the will to power.',
    13.99, 30, '978-0140441185', 'https://covers.openlibrary.org/b/isbn/9780140441185-L.jpg',
    1883, TRUE, (SELECT id FROM categories WHERE name = 'Philosophy'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 189
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0140441185');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Beyond Good and Evil', 'Friedrich Nietzsche',
    'Nietzsche critiques past philosophers and presents his vision of a new ruling class of human beings.',
    12.99, 25, '978-0679724659', 'https://covers.openlibrary.org/b/isbn/9780679724659-L.jpg',
    1886, TRUE, (SELECT id FROM categories WHERE name = 'Philosophy'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 167
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0679724659');

-- ============================================================
-- BIOGRAPHY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Steve Jobs', 'Walter Isaacson',
    'The exclusive biography of Apple''s visionary co-founder based on over 40 interviews.',
    22.99, 45, '978-1451648539', 'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
    2011, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Simon & Schuster'), 678
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1451648539');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Leonardo da Vinci', 'Walter Isaacson',
    'A comprehensive biography of history''s greatest creative genius based on thousands of journal pages.',
    25.99, 35, '978-1501139154', 'https://covers.openlibrary.org/b/isbn/9781501139154-L.jpg',
    2017, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Simon & Schuster'), 412
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1501139154');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Long Walk to Freedom', 'Nelson Mandela',
    'The autobiography of Nelson Mandela, from his childhood to his presidency of South Africa.',
    18.99, 40, '978-0316548182', 'https://covers.openlibrary.org/b/isbn/9780316548182-L.jpg',
    1994, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Scribner'), 345
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0316548182');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Educated', 'Tara Westover',
    'A memoir of a woman who grew up in a survivalist family and educated herself to earn a Cambridge PhD.',
    17.99, 55, '978-0399590504', 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
    2018, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Random House'), 734
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0399590504');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Becoming', 'Michelle Obama',
    'An intimate and powerful memoir by the former First Lady of the United States.',
    19.99, 65, '978-1524763138', 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg',
    2018, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Crown Publishers'), 812
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-1524763138');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Autobiography of Benjamin Franklin', 'Benjamin Franklin',
    'Franklin''s own account of his rise from obscurity to fame as a scientist, statesman, and philosopher.',
    10.99, 30, '978-0486290737', 'https://covers.openlibrary.org/b/isbn/9780486290737-L.jpg',
    1791, TRUE, (SELECT id FROM categories WHERE name = 'Biography'), (SELECT id FROM brands WHERE name = 'Penguin Books'), 189
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0486290737');

-- ============================================================
-- MYSTERY BOOKS
-- ============================================================
INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Girl with the Dragon Tattoo', 'Stieg Larsson',
    'A journalist investigates a decades-old family mystery involving murder, financial fraud, and secrets.',
    15.99, 50, '978-0307949486', 'https://covers.openlibrary.org/b/isbn/9780307949486-L.jpg',
    2005, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 623
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0307949486');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'And Then There Were None', 'Agatha Christie',
    'Ten strangers are lured to a remote island, and one by one begin to die — the world''s best-selling mystery.',
    12.99, 55, '978-0062073488', 'https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg',
    1939, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 534
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062073488');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Shining', 'Stephen King',
    'A family moves to an isolated hotel for the winter where a sinister presence influences the father.',
    14.99, 45, '978-0307743657', 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
    1977, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 589
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0307743657');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'The Murder on the Orient Express', 'Agatha Christie',
    'Hercule Poirot investigates a murder aboard the famous express train — anyone could be the killer.',
    12.99, 50, '978-0062693662', 'https://covers.openlibrary.org/b/isbn/9780062693662-L.jpg',
    1934, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'HarperCollins'), 445
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0062693662');

INSERT INTO books (title, author, description, price, stock_quantity, isbn, image_url, publication_year, active, category_id, brand_id, sales_count)
SELECT 'Big Little Lies', 'Liane Moriarty',
    'Three women whose lives unravel to the point of murder in this darkly comic tale of love and lies.',
    14.99, 40, '978-0425274866', 'https://covers.openlibrary.org/b/isbn/9780425274866-L.jpg',
    2014, TRUE, (SELECT id FROM categories WHERE name = 'Mystery'), (SELECT id FROM brands WHERE name = 'Vintage Books'), 478
WHERE NOT EXISTS (SELECT 1 FROM books WHERE isbn = '978-0425274866');
