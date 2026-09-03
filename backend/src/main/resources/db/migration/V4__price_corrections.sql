-- V4: Convert all book prices to proper Indian Rupee (INR) values
--     and remove the SPQR book with the broken cover image.

-- ============================================================
-- DELETE SPQR (broken cover)
-- ============================================================
DELETE FROM order_items WHERE book_id = (SELECT id FROM books WHERE isbn = '978-1631491252');
DELETE FROM wishlists  WHERE book_id = (SELECT id FROM books WHERE isbn = '978-1631491252');
DELETE FROM cart_items WHERE book_id = (SELECT id FROM books WHERE isbn = '978-1631491252');
DELETE FROM books WHERE isbn = '978-1631491252';

-- ============================================================
-- FICTION (V2)
-- ============================================================
UPDATE books SET price = 349.00  WHERE isbn = '978-0743273565'; -- The Great Gatsby
UPDATE books SET price = 399.00  WHERE isbn = '978-0061935466'; -- To Kill a Mockingbird
UPDATE books SET price = 329.00  WHERE isbn = '978-0451524935'; -- 1984
UPDATE books SET price = 369.00  WHERE isbn = '978-0345391803'; -- Hitchhiker's Guide

-- ============================================================
-- TECHNOLOGY (V2)
-- ============================================================
UPDATE books SET price = 2499.00  WHERE isbn = '978-0132350884'; -- Clean Code
UPDATE books SET price = 2799.00  WHERE isbn = '978-0135957059'; -- Pragmatic Programmer
UPDATE books SET price = 3999.00  WHERE isbn = '978-1449373320'; -- Designing Data-Intensive Applications
UPDATE books SET price = 3299.00  WHERE isbn = '978-1617292545'; -- Spring Boot in Action

-- ============================================================
-- SCIENCE (V2)
-- ============================================================
UPDATE books SET price = 449.00  WHERE isbn = '978-0553380163'; -- A Brief History of Time
UPDATE books SET price = 499.00  WHERE isbn = '978-0198788607'; -- The Selfish Gene
UPDATE books SET price = 549.00  WHERE isbn = '978-0345539434'; -- Cosmos

-- ============================================================
-- HISTORY (V2)
-- ============================================================
UPDATE books SET price = 599.00  WHERE isbn = '978-0062316110'; -- Sapiens
UPDATE books SET price = 549.00  WHERE isbn = '978-0393354324'; -- Guns, Germs, and Steel

-- ============================================================
-- SELF-HELP (V2)
-- ============================================================
UPDATE books SET price = 699.00  WHERE isbn = '978-0735211292'; -- Atomic Habits
UPDATE books SET price = 649.00  WHERE isbn = '978-1982137274'; -- The 7 Habits

-- ============================================================
-- FICTION (V3)
-- ============================================================
UPDATE books SET price = 299.00  WHERE isbn = '978-0141439518'; -- Pride and Prejudice
UPDATE books SET price = 369.00  WHERE isbn = '978-0316769174'; -- Catcher in the Rye
UPDATE books SET price = 349.00  WHERE isbn = '978-0060850524'; -- Brave New World
UPDATE books SET price = 329.00  WHERE isbn = '978-0399501487'; -- Lord of the Flies
UPDATE books SET price = 299.00  WHERE isbn = '978-0451526342'; -- Animal Farm
UPDATE books SET price = 349.00  WHERE isbn = '978-1451673319'; -- Fahrenheit 451
UPDATE books SET price = 399.00  WHERE isbn = '978-0062315007'; -- The Alchemist
UPDATE books SET price = 499.00  WHERE isbn = '978-0060883287'; -- One Hundred Years of Solitude
UPDATE books SET price = 399.00  WHERE isbn = '978-0143058144'; -- Crime and Punishment
UPDATE books SET price = 599.00  WHERE isbn = '978-0140449266'; -- The Count of Monte Cristo
UPDATE books SET price = 369.00  WHERE isbn = '978-0142437247'; -- Moby Dick
UPDATE books SET price = 329.00  WHERE isbn = '978-0141439570'; -- The Picture of Dorian Gray
UPDATE books SET price = 499.00  WHERE isbn = '978-0441013593'; -- Dune
UPDATE books SET price = 449.00  WHERE isbn = '978-0307474278'; -- The Da Vinci Code
UPDATE books SET price = 399.00  WHERE isbn = '978-0307588371'; -- Gone Girl

-- ============================================================
-- FANTASY (V3)
-- ============================================================
UPDATE books SET price = 799.00  WHERE isbn = '978-0618640157'; -- The Lord of the Rings
UPDATE books SET price = 399.00  WHERE isbn = '978-0439708180'; -- Harry Potter and the Sorcerer's Stone
UPDATE books SET price = 549.00  WHERE isbn = '978-0553573404'; -- A Game of Thrones
UPDATE books SET price = 499.00  WHERE isbn = '978-0756404079'; -- The Name of the Wind
UPDATE books SET price = 369.00  WHERE isbn = '978-0812550702'; -- Ender's Game
UPDATE books SET price = 349.00  WHERE isbn = '978-0439023481'; -- The Hunger Games
UPDATE books SET price = 449.00  WHERE isbn = '978-0062572233'; -- American Gods

-- ============================================================
-- TECHNOLOGY (V3)
-- ============================================================
UPDATE books SET price = 1999.00  WHERE isbn = '978-0596517748'; -- JavaScript: The Good Parts
UPDATE books SET price = 2299.00  WHERE isbn = '978-1593279288'; -- Python Crash Course
UPDATE books SET price = 1799.00  WHERE isbn = '978-1593279509'; -- Eloquent JavaScript
UPDATE books SET price = 4999.00  WHERE isbn = '978-0262033848'; -- Introduction to Algorithms
UPDATE books SET price = 3999.00  WHERE isbn = '978-0201633610'; -- Design Patterns
UPDATE books SET price = 3499.00  WHERE isbn = '978-0735619678'; -- Code Complete
UPDATE books SET price = 2999.00  WHERE isbn = '978-0134757599'; -- Refactoring
UPDATE books SET price = 2799.00  WHERE isbn = '978-0984782857'; -- Cracking the Coding Interview
UPDATE books SET price = 14999.00 WHERE isbn = '978-0201853926'; -- The Art of Computer Programming

-- ============================================================
-- SCIENCE (V3)
-- ============================================================
UPDATE books SET price = 349.00  WHERE isbn = '978-0451529060'; -- The Origin of Species
UPDATE books SET price = 529.00  WHERE isbn = '978-0393316049'; -- Surely You're Joking, Mr. Feynman!
UPDATE books SET price = 499.00  WHERE isbn = '978-0393609394'; -- Astrophysics for People in a Hurry
UPDATE books SET price = 549.00  WHERE isbn = '978-1501144318'; -- Why We Sleep
UPDATE books SET price = 529.00  WHERE isbn = '978-1250062185'; -- The Sixth Extinction
UPDATE books SET price = 599.00  WHERE isbn = '978-1476733524'; -- The Gene: An Intimate History
UPDATE books SET price = 499.00  WHERE isbn = '978-0553384666'; -- The Grand Design

-- ============================================================
-- HISTORY (V3)
-- ============================================================
UPDATE books SET price = 349.00  WHERE isbn = '978-0553577129'; -- The Diary of a Young Girl
UPDATE books SET price = 649.00  WHERE isbn = '978-0743270755'; -- Team of Rivals
UPDATE books SET price = 649.00  WHERE isbn = '978-0062464316'; -- Homo Deus
UPDATE books SET price = 649.00  WHERE isbn = '978-0525512172'; -- 21 Lessons for the 21st Century
UPDATE books SET price = 299.00  WHERE isbn = '978-0140455526'; -- The Art of War

-- ============================================================
-- SELF-HELP (V3)
-- ============================================================
UPDATE books SET price = 369.00  WHERE isbn = '978-0807014271'; -- Man's Search for Meaning
UPDATE books SET price = 399.00  WHERE isbn = '978-0671027032'; -- How to Win Friends and Influence People
UPDATE books SET price = 369.00  WHERE isbn = '978-1585424337'; -- Think and Grow Rich
UPDATE books SET price = 499.00  WHERE isbn = '978-1612680194'; -- Rich Dad Poor Dad
UPDATE books SET price = 449.00  WHERE isbn = '978-1577314806'; -- The Power of Now

-- ============================================================
-- BUSINESS (V3)
-- ============================================================
UPDATE books SET price = 749.00  WHERE isbn = '978-0066620992'; -- Good to Great
UPDATE books SET price = 699.00  WHERE isbn = '978-0804139021'; -- Zero to One
UPDATE books SET price = 749.00  WHERE isbn = '978-0307887894'; -- The Lean Startup
UPDATE books SET price = 649.00  WHERE isbn = '978-0374533557'; -- Thinking, Fast and Slow
UPDATE books SET price = 599.00  WHERE isbn = '978-0316017930'; -- Outliers
UPDATE books SET price = 799.00  WHERE isbn = '978-0062060242'; -- The Innovator's Dilemma
UPDATE books SET price = 549.00  WHERE isbn = '978-0316316965'; -- The Tipping Point

-- ============================================================
-- PHILOSOPHY (V3)
-- ============================================================
UPDATE books SET price = 349.00  WHERE isbn = '978-0812968255'; -- Meditations
UPDATE books SET price = 369.00  WHERE isbn = '978-0872201361'; -- The Republic
UPDATE books SET price = 399.00  WHERE isbn = '978-0140441185'; -- Thus Spoke Zarathustra
UPDATE books SET price = 369.00  WHERE isbn = '978-0679724659'; -- Beyond Good and Evil

-- ============================================================
-- BIOGRAPHY (V3)
-- ============================================================
UPDATE books SET price = 749.00  WHERE isbn = '978-1451648539'; -- Steve Jobs
UPDATE books SET price = 799.00  WHERE isbn = '978-1501139154'; -- Leonardo da Vinci
UPDATE books SET price = 599.00  WHERE isbn = '978-0316548182'; -- Long Walk to Freedom
UPDATE books SET price = 549.00  WHERE isbn = '978-0399590504'; -- Educated
UPDATE books SET price = 649.00  WHERE isbn = '978-1524763138'; -- Becoming
UPDATE books SET price = 349.00  WHERE isbn = '978-0486290737'; -- The Autobiography of Benjamin Franklin

-- ============================================================
-- MYSTERY (V3)
-- ============================================================
UPDATE books SET price = 449.00  WHERE isbn = '978-0307949486'; -- The Girl with the Dragon Tattoo
UPDATE books SET price = 349.00  WHERE isbn = '978-0062073488'; -- And Then There Were None
UPDATE books SET price = 399.00  WHERE isbn = '978-0307743657'; -- The Shining
UPDATE books SET price = 349.00  WHERE isbn = '978-0062693662'; -- The Murder on the Orient Express
UPDATE books SET price = 399.00  WHERE isbn = '978-0425274866'; -- Big Little Lies
