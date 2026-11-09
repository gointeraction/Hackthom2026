CREATE TABLE IF NOT EXISTS emails_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  destinatario TEXT NOT NULL,
  asunto TEXT,
  tipo TEXT,
  estado TEXT,
  error TEXT,
  referencia TEXT,
  creado_en TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_emails_log_creado ON emails_log (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_emails_log_tipo ON emails_log (tipo);
