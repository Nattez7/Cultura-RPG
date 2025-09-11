// Knowledge Loader - Carrega dados de conhecimento
class KnowledgeLoader {
    constructor() {
        this.knowledgeData = {};
        this.loaded = false;
        this.init();
    }

    init() {
        // Dados de conhecimento baseados no quiz-data.js
        this.knowledgeData = {
            "Música Brasileira": {
                category: "Música",
                icon: "fas fa-music",
                price: 1,
                descriptions: [
                    "Conhecimento básico sobre música brasileira",
                    "Aprenda sobre samba, bossa nova e outros ritmos brasileiros"
                ]
            },
            "Literatura": {
                category: "Literatura",
                icon: "fas fa-book",
                price: 1,
                descriptions: [
                    "Conhecimento sobre literatura brasileira",
                    "Explore as obras de Machado de Assis e literatura de cordel"
                ]
            },
            "Culinária": {
                category: "Culinária",
                icon: "fas fa-utensils",
                price: 1,
                descriptions: [
                    "Conhecimento sobre culinária brasileira",
                    "Descubra os sabores únicos da gastronomia nacional"
                ]
            },
            "Artes Marciais": {
                category: "Artes Marciais",
                icon: "fas fa-fist-raised",
                price: 1,
                descriptions: [
                    "Conhecimento sobre artes marciais brasileiras",
                    "Aprenda sobre capoeira, jiu-jitsu e outras lutas brasileiras"
                ]
            },
            "Festas Populares": {
                category: "Festas",
                icon: "fas fa-calendar-alt",
                price: 1,
                descriptions: [
                    "Conhecimento sobre festas populares brasileiras",
                    "Conheça o Carnaval, festas juninas e outras celebrações"
                ]
            }
        };

        this.loaded = true;
        
        // Disparar evento de carregamento completo
        window.dispatchEvent(new CustomEvent('knowledgeLoaded'));
    }

    getAllKnowledge() {
        return this.knowledgeData;
    }

    getKnowledge(name) {
        return this.knowledgeData[name] || null;
    }

    isLoaded() {
        return this.loaded;
    }
}

// Instância global
const knowledgeLoader = new KnowledgeLoader();