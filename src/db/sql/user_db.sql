CREATE TABLE IF NOT EXISTS users
(
    id
    INT
    PRIMARY
    KEY
    AUTO_INCREMENT,
    userName
    VARCHAR
(
    50
),
    email VARCHAR
(
    255
) NOT NULL,
    password VARCHAR
(
    255
) NOT NULL,
    highScore INT DEFAULT
(
    0
),
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );