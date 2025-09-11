# Configuração do Firebase - Cultura RPG

## Passos para configurar o Firebase:

### 1. Criar projeto no Firebase Console
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Nome do projeto: `cultura-rpg` (ou outro nome de sua escolha)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Authentication
1. No painel do Firebase, vá em "Authentication"
2. Clique em "Começar"
3. Na aba "Sign-in method", habilite:
   - **Email/Password**: Clique e habilite
   - **Google**: Clique, habilite e configure:
     - Project support email: seu email
     - Client ID: `662548306610-sdhvo4k0vaouhch83l71nvtgqsjskpet.apps.googleusercontent.com`

### 3. Configurar Firestore Database
1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (por enquanto)
4. Escolha a localização (recomendado: southamerica-east1)

### 4. Configurar regras do Firestore
Substitua as regras padrão por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Knowledge and categories - read for all, write for authenticated users
    match /knowledge/{knowledgeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**OU para modo de teste (mais permissivo):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if true;
  }
}
```

### 5. Obter credenciais do projeto
1. No painel do Firebase, clique no ícone de engrenagem > "Configurações do projeto"
2. Role até "Seus aplicativos" e clique em "Web" (ícone </>)
3. Registre o app com nome "Cultura RPG"
4. Copie as credenciais que aparecem

### 6. Atualizar firebase-config.js
Substitua as credenciais no arquivo `assets/js/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "662548306610",
    appId: "SEU_APP_ID_AQUI"
};
```

### 7. Configurar domínios autorizados
1. Em Authentication > Settings > Authorized domains
2. Adicione seus domínios (localhost já está incluído)
3. Para produção, adicione seu domínio real

## Estrutura de dados no Firestore:

### Coleção: `users`
```javascript
{
  uid: "user_id",
  email: "user@email.com",
  displayName: "Nome do Usuário",
  photoURL: "url_da_foto",
  createdAt: timestamp,
  lastLogin: timestamp,
  gameData: {
    level: 1,
    experience: 0,
    coins: 100,
    ownedKnowledge: {},
    completedQuests: [],
    dailyQuests: [],
    character: {
      name: "Nome do Personagem",
      age: 25,
      appearance: "Descrição",
      // ... outros dados do personagem
    }
  },
  // Dados adicionais do registro
  fullName: "Nome Completo",
  username: "username",
  birthdate: "1990-01-01",
  age: 33,
  phone: "(11) 99999-9999"
}
```

## Funcionalidades implementadas:

✅ **Autenticação**
- Login com email/senha
- Login com Google
- Registro de novos usuários
- Recuperação de senha
- Logout

✅ **Banco de dados**
- Sincronização automática entre localStorage e Firestore
- Salvamento automático a cada 30 segundos
- Carregamento de dados na autenticação

✅ **Segurança**
- Redirecionamento automático baseado no estado de autenticação
- Regras de segurança no Firestore
- Validação de dados

## Testando a implementação:

1. Configure as credenciais do Firebase
2. Abra o projeto no navegador
3. Teste o registro de um novo usuário
4. Teste o login com email/senha
5. Teste o login com Google
6. Verifique se os dados estão sendo salvos no Firestore Console

## Próximos passos opcionais:

- Configurar regras de produção mais restritivas
- Adicionar validação de email
- Implementar perfis de usuário mais detalhados
- Adicionar sistema de backup/restore