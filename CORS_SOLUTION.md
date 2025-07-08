# Guia de Resolução de CORS

## 🔧 Configuração do Proxy Angular

Para resolver o problema de CORS durante o desenvolvimento, foi configurado um proxy no Angular que redireciona todas as requisições `/api/*` para `http://localhost:3000`.

### Arquivos Configurados:

#### 1. `proxy.conf.json` (CRIADO)
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

#### 2. `angular.json` (ATUALIZADO)
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "configurations": {
    "development": {
      "buildTarget": "trello-clone:build:development",
      "proxyConfig": "proxy.conf.json"
    }
  }
}
```

#### 3. `package.json` (ATUALIZADO)
```json
"scripts": {
  "start": "ng serve --proxy-config proxy.conf.json",
  "start:no-proxy": "ng serve"
}
```

#### 4. Environment Variables (ATUALIZADAS)
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: '/api', // Usando URL relativa para o proxy
  useMockApi: false,
  appName: 'Trello Clone'
};
```

#### 5. Serviços (ATUALIZADOS)
Todos os serviços agora usam `environment.apiUrl` ao invés de URL hardcoded:

```typescript
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  // ...
}
```

## 🚀 Como Usar

### 1. Certifique-se que o backend NestJS está rodando:
```bash
# No diretório do backend
npm run start:dev
```

### 2. Pare o servidor Angular atual (se rodando):
```bash
# Pressione Ctrl+C no terminal ou
pkill -f "ng serve"
```

### 3. Inicie o servidor com proxy:
```bash
# Opção 1: Usando o script npm
npm start

# Opção 2: Comando direto
ng serve --proxy-config proxy.conf.json
```

### 4. Acesse a aplicação:
```
http://localhost:4200
```

## 🔄 Como Funciona

1. **Frontend (Angular)**: Roda em `http://localhost:4200`
2. **Backend (NestJS)**: Roda em `http://localhost:3000` 
3. **Proxy**: Redireciona `/api/*` → `http://localhost:3000/*`

### Exemplo de Requisição:
```typescript
// Frontend faz requisição para:
this.http.post('/api/auth/login', credentials)

// Proxy redireciona para:
http://localhost:3000/auth/login
```

## ✅ Verificação

Para verificar se o proxy está funcionando:

1. Abra o DevTools do browser (F12)
2. Na aba Network, veja se as requisições aparecem como `/api/...`
3. Se aparecer erro 404, verifique se o backend está rodando
4. Se aparecer erro de CORS, reinicie o servidor Angular

## 🔧 Troubleshooting

### Erro: "Cannot find module 'proxy-conf'"
```bash
# Verifique se o arquivo existe
ls -la proxy.conf.json

# Reinicie o servidor
ng serve --proxy-config proxy.conf.json
```

### Erro: "Backend connection refused"
```bash
# Verifique se o backend está rodando
curl http://localhost:3000/health

# Ou inicie o backend
cd ../backend && npm run start:dev
```

### Erro: "CORS ainda aparece"
```bash
# Limpe o cache do browser
# Ou abra uma aba privada/incógnita
```

## 🎯 Resultado

✅ **Sem erros de CORS**  
✅ **Requisições funcionando**  
✅ **Login/Registro funcionando**  
✅ **CRUD de boards/lists/cards funcionando**  

A aplicação agora funciona perfeitamente com a API real do NestJS!
