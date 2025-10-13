// Configuração do EmailJS para envio de avaliações
// Para configurar:
// 1. Criar conta em https://www.emailjs.com/
// 2. Criar um serviço de email
// 3. Criar template com as variáveis:
//    - user_name, user_email, quality, fun, usability, recommendation
//    - cultural_learning, feedback_text, cultural_text, submitted_at
// 4. Substituir as chaves abaixo pelas reais

const EMAILJS_CONFIG = {
    PUBLIC_KEY: '4OwzCX2KKYArb6n6k',
    SERVICE_ID: 'service_aue2fxu', 
    TEMPLATE_ID: 'template_evaluation'
};

// Template de email sugerido:
/*
Assunto: Nova Avaliação - Cultura RPG

Olá!

Uma nova avaliação foi enviada pelo sistema Cultura RPG:

DADOS DO USUÁRIO:
Nome: {{user_name}}
Email: {{user_email}}
Data: {{submitted_at}}

AVALIAÇÕES (1-10):
Qualidade das sessões: {{quality}}
Diversão: {{fun}}
Facilidade de uso: {{usability}}
Recomendação: {{recommendation}}
Aprendizado cultural: {{cultural_learning}}

COMENTÁRIOS:
{{feedback_text}}

IMPACTO CULTURAL:
{{cultural_text}}

---
Sistema Cultura RPG
*/

// Inicializar EmailJS quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
});