# Configuração Firebase - Passo a Passo

## 1. Configurar Regras do Realtime Database

Acesse: Firebase Console → Realtime Database → Rules

Cole exatamente isto:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Clique em "Publicar"

## 2. Ativar Authentication

Firebase Console → Authentication → Sign-in method
- Ativar "Email/password"

## 3. Adicionar Dados Manualmente (Alternativa)

Firebase Console → Realtime Database → Dados

Clique no "+" ao lado da raiz e adicione:

### Personagens:
```
personagens/
  zumbi/
    name: "Zumbi dos Palmares"
    description: "Líder quilombola, símbolo da resistência contra a escravidão."
    stats/
      força: 3
      sabedoria: 1
      carisma: 1
    background: "Nascido livre em Palmares..."
    talents/
      0: "Liderança de Guerra: +1 dado extra em situações de combate"
      1: "Resistência Quilombola: Pode rolar novamente falhas"
    image: "https://via.placeholder.com/200x250/8B4513/FFFFFF?text=Zumbi"
```

### Missões:
```
missoes/
  carnaval/
    name: "As Origens do Carnaval"
    description: "Explore as raízes culturais do Carnaval brasileiro"
    difficulty: "iniciante"
    duration: "2-3 horas"
```

## 4. Verificar URL do Database

Certifique-se que a URL no firebase-config.js está correta:
`https://tcc-unifeso-default-rtdb.firebaseio.com`