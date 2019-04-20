
CREATE TABLE Member (
  id BIGINT PRIMARY KEY,
  username VARCHAR(100),
  money INTEGER DEFAULT 1000
);

CREATE TABLE Cosmetic (
  id SERIAL PRIMARY KEY,
  memberid BIGINT REFERENCES Member(id),
  emoji VARCHAR(10) NOT NULL,
  available BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO Cosmetic (emoji)
VALUES
  ('🍉'), ('🍔'), ('🔥'), ('🌈'), ('💕'),
  ('😘'), ('🐹'), ('🐳'), ('❄'), ('🍜')