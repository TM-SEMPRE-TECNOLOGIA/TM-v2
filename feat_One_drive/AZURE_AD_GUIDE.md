# Guia: Registro de Aplicativo no Azure (Microsoft Entra ID)

Este guia detalha os passos necessários para configurar o acesso às APIs do Microsoft Graph para integração com OneDrive e Excel.

## 1. Criar novo registro
1. Acesse o [Portal da Azure](https://portal.azure.com/).
2. Vá em **Microsoft Entra ID** (antigo Azure Active Directory).
3. No menu lateral, clique em **App registrations** > **New registration**.
4. **Nome:** `MAFFENG-CMMS-OneDrive`.
5. **Supported account types:** Selecione "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts".
6. **Redirect URI:**
   - Selecione **Single-page application (SPA)**.
   - URI: `http://localhost:5173` (para desenvolvimento local).
7. Clique em **Register**.

## 2. Configurar Autenticação
1. No menu lateral do App, vá em **Authentication**.
2. Garanta que o redirecionamento SPA esteja correto.
3. Se for usar fluxo de backend (Fase 2), adicione uma URI de redirecionamento de **Web** (ex: `http://localhost:3001/api/auth/callback`).
4. Ative **Access tokens** e **ID tokens** em **Implicit grant and hybrid flows**.

## 3. Certificados e Segredos (Fase 2 - Sincronização Automática)
1. Vá em **Certificates & secrets**.
2. Clique em **New client secret**.
3. Descrição: `MAFFENG-Sync-Secret`.
4. Expiração: Recomendado 24 meses.
5. **IMPORTANTE:** Copie o **Value** (não o Secret ID) imediatamente. Ele não será exibido novamente.

## 4. Permissões de API
1. Vá em **API permissions** > **Add a permission**.
2. Selecione **Microsoft Graph**.
3. Selecione **Delegated permissions**.
4. Adicione:
   - `User.Read` (perfil básico)
   - `Files.Read` (leitura de arquivos)
   - `Files.Read.All` (leitura de todos os arquivos acessíveis)
   - `offline_access` (necessário para refresh tokens)
5. Clique em **Add permissions**.

## 5. IDs Necessários para o Código
Ao configurar o arquivo `.env`, você precisará de:
- **Application (client) ID**: Identifica o seu app.
- **Directory (tenant) ID**: Identifica a organização (ou use `common` para multitenant).
- **Client Secret**: O valor copiado no passo 3.
