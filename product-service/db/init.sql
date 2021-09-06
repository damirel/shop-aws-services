CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products
(
    id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       text NOT NULL,
    description text,
    price       integer
);


CREATE TABLE IF NOT EXISTS stocks
(
    product_id uuid,
    FOREIGN KEY (product_id) REFERENCES products (id),
    count      integer
);

WITH products AS (
    INSERT INTO products (title, description, price) VALUES ('Crepey Skin Pre-Treatment Exfoliating Scrub',
                                                             'Skin-softening pre-treatment exfoliates and smooths to diminish the look of crepey skin', 16),
                                                            ('Skin-softening pre-treatment exfoliates and smooths to diminish the look of crepey skin',
                                                             'Enriched with skin-firming Copper Peptides and anti-aging Resveratrol, our silky, concentrated serum protects against collagen degradation as it nourishes and moisturizes the skin',
                                                             20),
                                                            ('Deluxe Hydrating Night Cream',
                                                             'Providing hydration throughout the night, this rich cream helps plump skin to reduce the look of lines and wrinkles for a younger-looking complexion',
                                                             5),
                                                            ('Advanced Peptides and Collagen Moisturizer',
                                                             'Deep Wrinkle Moisturizer is now Advanced Peptide and Collagen Moisturizer', 35),
                                                            ('Anti-Wrinkle Cleanser',
                                                             'Our gentle exfoliating, sulfate-free cleanser helps to deeply cleanse as well as help to reduce the appearance of fine lines and wrinkles for a youthful-looking complexion',
                                                             14),
                                                            ('Anti-Wrinkle Treatment Oil',
                                                             'Our fragrance-free, potent concentration of Vitamins A and E base helps keep skin youthful and vibrant',
                                                             14)
        RETURNING id, title
)
INSERT INTO stocks (product_id, count)
VALUES ((SELECT products.id FROM products WHERE products.title = 'Crepey Skin Pre-Treatment Exfoliating Scrub'), 20),
       ((SELECT products.id FROM products WHERE products.title = 'Deluxe Hydrating Night Cream'), 10),
       ((SELECT products.id FROM products WHERE products.title = 'Skin-softening pre-treatment exfoliates and smooths to diminish the look of crepey skin'), 50),
       ((SELECT products.id FROM products WHERE products.title = 'Advanced Peptides and Collagen Moisturizer'), 10),
       ((SELECT products.id FROM products WHERE products.title = 'Anti-Wrinkle Cleanser'), 5),
       ((SELECT products.id FROM products WHERE products.title = 'Anti-Wrinkle Treatment Oil'), 30);