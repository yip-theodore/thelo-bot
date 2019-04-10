
CREATE TABLE user (id TEXT PRIMARY KEY, money INTEGER);
CREATE UNIQUE INDEX idx_user_id ON user (id);
PRAGMA synchronous = 1;
PRAGMA journal_mode = wal;
