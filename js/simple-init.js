// Versão simplificada para testar a conexão
import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function testConnection() {
    try {
        // Teste simples - salvar um valor
        await setDoc(doc(db, 'teste', 'conexao'), {
            timestamp: new Date().toISOString(),
            message: 'Conexão funcionando'
        });
        
        console.log('Teste de conexão bem-sucedido!');
        return true;
    } catch (error) {
        console.error('Erro na conexão:', error);
        throw error;
    }
}

export async function initPersonagens() {
    try {
        const personagem = {
            name: 'Zumbi dos Palmares',
            description: 'Líder quilombola, símbolo da resistência contra a escravidão.',
            stats: { força: 3, sabedoria: 1, carisma: 1 }
        };
        
        await setDoc(doc(db, 'personagens', 'zumbi'), personagem);
        console.log('Personagem teste salvo!');
        return true;
    } catch (error) {
        console.error('Erro ao salvar personagem:', error);
        throw error;
    }
}