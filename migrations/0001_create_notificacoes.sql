DO $$ BEGIN
  CREATE TYPE "notificacao_status_leitura" AS ENUM ('lida', 'nao_lida');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "notificacoes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "data" timestamp NOT NULL DEFAULT now(),
  "titulo" text NOT NULL,
  "mensagem" text NOT NULL,
  "status_leitura" "notificacao_status_leitura" NOT NULL DEFAULT 'nao_lida'
);
