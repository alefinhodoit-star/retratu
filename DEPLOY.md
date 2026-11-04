# Deploy

Um único processo Node serve **o site e a API**. Não há passo de build no servidor além de `npm run build`.

```
Internet → proxy inverso (HTTPS) → Node (3001) → SQLite em data/
```

## Requisitos

- Um servidor Linux com **Node 22** (ou Docker)
- O domínio `retratu.pt` com DNS a apontar para o servidor
- 512 MB de RAM e 1 GB de disco são suficientes

## Opção A — Docker (recomendado)

```bash
git clone https://github.com/alefinhodoit-star/retratu.git
cd retratu

cp .env.example .env
# edite o .env e defina JWT_SECRET (openssl rand -hex 48)

docker compose up -d --build
```

O `data/` fica montado como volume, por isso a base de dados sobrevive a
reconstruções da imagem.

```bash
docker compose logs -f      # ver logs
docker compose restart      # reiniciar
docker compose down         # parar
```

## Opção B — Node direto

```bash
git clone https://github.com/alefinhodoit-star/retratu.git
cd retratu

npm ci
npm run build

cp .env.example .env
# edite o .env

npm start
```

Para manter a correr, crie `/etc/systemd/system/retratu.service`:

```ini
[Unit]
Description=Retratu
After=network.target

[Service]
Type=simple
User=retratu
WorkingDirectory=/srv/retratu
EnvironmentFile=/srv/retratu/.env
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now retratu
sudo systemctl status retratu
```

## HTTPS com proxy inverso

O Node **não** termina TLS. Use um proxy à frente.

### Caddy (mais simples — certificados automáticos)

`/etc/caddy/Caddyfile`:

```
retratu.pt, www.retratu.pt {
    reverse_proxy 127.0.0.1:3001
}
```

### Nginx

```nginx
server {
    listen 80;
    server_name retratu.pt www.retratu.pt;
    return 301 https://retratu.pt$request_uri;
}

server {
    listen 443 ssl http2;
    server_name retratu.pt;

    ssl_certificate     /etc/letsencrypt/live/retratu.pt/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/retratu.pt/privkey.pem;

    # Uploads de imagens até 10 MB
    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Certificado: `sudo certbot --nginx -d retratu.pt -d www.retratu.pt`

## DNS

No painel do registador:

| Tipo | Nome | Valor |
|---|---|---|
| `A` | `@` | IP do servidor |
| `A` | `www` | IP do servidor |

## Primeiro acesso

1. Abra `https://retratu.pt/register`.
2. Registe-se — **o primeiro utilizador fica com perfil `admin`**.
3. Confirme em `https://retratu.pt/admin`.

Se já existir alguém na base de dados, os registos seguintes ficam `user`.

## Backup

A base de dados é o único estado que não está no git. Com o serviço a correr:

```bash
sqlite3 data/retratu.db ".backup 'backups/retratu-$(date +%F).db'"
```

Copiar só o `retratu.db` com `cp` pode perder as últimas escritas por causa do
WAL. Inclua também `data/uploads/` se quiser guardar as imagens carregadas.

Cron diário de exemplo:

```cron
0 3 * * * cd /srv/retratu && sqlite3 data/retratu.db ".backup 'backups/retratu-$(date +\%F).db'"
```

## Atualizar

```bash
git pull
# Docker:
docker compose up -d --build
# Node:
npm ci && npm run build && sudo systemctl restart retratu
```

O schema é criado com `CREATE TABLE IF NOT EXISTS`, por isso não há migrações a
correr à mão.

## Verificação

```bash
curl -s https://retratu.pt/api/health
# {"ok":true,"entidades":[...]}

curl -sI https://retratu.pt/ | head -1
# HTTP/2 200
```

## Variáveis de ambiente

| Variável | Obrigatória | Efeito |
|---|---|---|
| `PORT` | não | porta do Node (3001 por omissão) |
| `JWT_SECRET` | recomendada | assinatura dos tokens; sem ela é gerado em `data/.jwt-secret` |
| `APP_ORIGIN` | não | origem autorizada para CORS |

## Ainda não incluído

- **Envio de e-mail** — a recuperação de palavra-passe responde `501`.
- **Login com Google** — precisa de um servidor OAuth.
- **Limite de tentativas de login** — sem rate limiting, um ataque de força bruta não é travado. Se o site ficar exposto, vale a pena pôr `fail2ban` ou um limite no proxy.
