CREATE TABLE photos(
    photo_id SERIAL PRIMARY KEY,
    photo_location VARCHAR(80),
    photo_description VARCHAR(255),
    photo_img VARCHAR(255)
);