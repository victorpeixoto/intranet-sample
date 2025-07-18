import { 
  users, notices, news, opportunities, services, documents, 
  chatMessages, tickets, emergencyNotifications, articles,
  type User, type InsertUser, type Notice, type InsertNotice,
  type News, type InsertNews, type Opportunity, type InsertOpportunity,
  type Service, type InsertService, type Document, type InsertDocument,
  type ChatMessage, type InsertChatMessage, type Ticket, type InsertTicket,
  type EmergencyNotification, type InsertEmergencyNotification,
  type Article, type InsertArticle
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notice operations
  getNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  
  // News operations
  getNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  
  // Opportunity operations
  getOpportunities(): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Document operations
  getDocuments(): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Chat operations
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Ticket operations
  getTickets(): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicketStatus(id: number, status: string): Promise<Ticket>;
  
  // Emergency notification operations
  getActiveEmergencyNotifications(): Promise<EmergencyNotification[]>;
  createEmergencyNotification(notification: InsertEmergencyNotification): Promise<EmergencyNotification>;
  deactivateEmergencyNotification(id: number): Promise<void>;
  
  // Article operations
  getArticles(): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticleByDocumentId(documentId: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notices: Map<number, Notice>;
  private news: Map<number, News>;
  private opportunities: Map<number, Opportunity>;
  private services: Map<number, Service>;
  private documents: Map<number, Document>;
  private chatMessages: Map<number, ChatMessage>;
  private tickets: Map<number, Ticket>;
  private emergencyNotifications: Map<number, EmergencyNotification>;
  private articles: Map<number, Article>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.notices = new Map();
    this.news = new Map();
    this.opportunities = new Map();
    this.services = new Map();
    this.documents = new Map();
    this.chatMessages = new Map();
    this.tickets = new Map();
    this.emergencyNotifications = new Map();
    this.articles = new Map();
    this.currentId = 1;
    
    // Create default admin user
    this.createUser({
      email: "admin@empresa.com",
      password: "admin123",
      name: "Administrador",
      isAdmin: true
    });

    // Create mock articles
    this.initializeMockArticles();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getNotices(): Promise<Notice[]> {
    return Array.from(this.notices.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createNotice(insertNotice: InsertNotice): Promise<Notice> {
    const id = this.currentId++;
    const notice: Notice = { 
      ...insertNotice, 
      id, 
      createdAt: new Date() 
    };
    this.notices.set(id, notice);
    return notice;
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentId++;
    const news: News = { 
      ...insertNews, 
      id, 
      createdAt: new Date() 
    };
    this.news.set(id, news);
    return news;
  }

  async getOpportunities(): Promise<Opportunity[]> {
    return Array.from(this.opportunities.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createOpportunity(insertOpportunity: InsertOpportunity): Promise<Opportunity> {
    const id = this.currentId++;
    const opportunity: Opportunity = { 
      ...insertOpportunity, 
      id, 
      createdAt: new Date() 
    };
    this.opportunities.set(id, opportunity);
    return opportunity;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentId++;
    const service: Service = { 
      ...insertService, 
      id, 
      createdAt: new Date() 
    };
    this.services.set(id, service);
    return service;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentId++;
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: new Date() 
    };
    this.documents.set(id, document);
    return document;
  }

  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => 
      new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
    );
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: new Date() 
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.currentId++;
    const ticket: Ticket = { 
      ...insertTicket, 
      id, 
      createdAt: new Date() 
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicketStatus(id: number, status: string): Promise<Ticket> {
    const ticket = this.tickets.get(id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const updatedTicket = { ...ticket, status };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async getActiveEmergencyNotifications(): Promise<EmergencyNotification[]> {
    return Array.from(this.emergencyNotifications.values())
      .filter(notification => notification.isActive)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async createEmergencyNotification(insertNotification: InsertEmergencyNotification): Promise<EmergencyNotification> {
    const id = this.currentId++;
    const notification: EmergencyNotification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date() 
    };
    this.emergencyNotifications.set(id, notification);
    return notification;
  }

  async deactivateEmergencyNotification(id: number): Promise<void> {
    const notification = this.emergencyNotifications.get(id);
    if (notification) {
      this.emergencyNotifications.set(id, { ...notification, isActive: false });
    }
  }

  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort((a, b) => 
      new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime()
    );
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.category === category)
      .sort((a, b) => 
        new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime()
      );
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleByDocumentId(documentId: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.documentId === documentId);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    
    // Get author name from user
    const author = this.users.get(insertArticle.authorId);
    const authorName = author ? author.name : 'Usuário Desconhecido';
    
    const article: Article = { 
      ...insertArticle,
      author: authorName,
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article> {
    const existingArticle = this.articles.get(id);
    if (!existingArticle) {
      throw new Error('Article not found');
    }
    
    // Update author name if authorId changed
    let authorName = existingArticle.author;
    if (updateData.authorId && updateData.authorId !== existingArticle.authorId) {
      const author = this.users.get(updateData.authorId);
      authorName = author ? author.name : 'Usuário Desconhecido';
    }
    
    const updatedArticle = { 
      ...existingArticle, 
      ...updateData,
      author: authorName,
      updatedAt: new Date() 
    };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  private async initializeMockArticles() {
    const adminUser = Array.from(this.users.values()).find(u => u.isAdmin);
    if (!adminUser) return;

    // Mock News Article
    await this.createArticle({
      documentId: "news001-tech-innovation",
      title: "Nova Tecnologia de IA Revoluciona Processos Internos",
      description: "Como a implementação da nova ferramenta de inteligência artificial está otimizando nossas operações diárias",
      slug: "nova-tecnologia-ia-revoluciona-processos-internos",
      category: "news",
      coverUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
      coverAlt: "Imagem representando tecnologia e inovação",
      content: "A empresa implementou uma nova solução de IA que promete revolucionar nossos processos internos...",
      body: `<h2>Revolução Tecnológica em Curso</h2>
      
<p>A empresa deu um passo significativo em direção ao futuro com a implementação de uma nova solução de inteligência artificial que está transformando completamente nossos processos internos. Esta tecnologia de ponta promete aumentar a eficiência operacional em até 40% nos próximos meses.</p>

<h3>Principais Benefícios</h3>
<ul>
<li>Automatização de tarefas repetitivas</li>
<li>Análise preditiva de dados em tempo real</li>
<li>Otimização de recursos humanos</li>
<li>Redução significativa de erros operacionais</li>
</ul>

<p>A implementação já começou nos departamentos de vendas e atendimento ao cliente, com resultados impressionantes. Os funcionários relatam uma redução de 60% no tempo gasto em tarefas administrativas, permitindo maior foco em atividades estratégicas.</p>

<h3>Próximas Etapas</h3>
<p>Nas próximas semanas, a tecnologia será expandida para outros departamentos, incluindo recursos humanos e financeiro. Treinalandos específicos serão oferecidos para garantir que todos os funcionários estejam preparados para aproveitar ao máximo essas novas ferramentas.</p>`,
      author: adminUser.name,
      authorId: adminUser.id,
      publishedAt: new Date()
    });

    // Mock Warning Article
    await this.createArticle({
      documentId: "warning001-security-update",
      title: "Atualização Importante de Segurança - Ação Necessária",
      description: "Novas medidas de segurança entram em vigor na próxima semana. Todos os funcionários devem atualizar suas senhas",
      slug: "atualizacao-importante-seguranca-acao-necessaria",
      category: "warnings",
      coverUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
      coverAlt: "Símbolo de segurança digital",
      content: "Por motivos de segurança, todos os funcionários devem atualizar suas senhas até o final da semana...",
      body: `<h2>Medidas de Segurança Obrigatórias</h2>

<p><strong>ATENÇÃO:</strong> Por motivos de segurança, todos os funcionários devem implementar as seguintes medidas até <strong>sexta-feira, 25 de julho</strong>:</p>

<h3>Ações Obrigatórias</h3>
<ol>
<li>Atualizar senha do sistema corporativo</li>
<li>Ativar autenticação de dois fatores (2FA)</li>
<li>Revisar permissões de acesso</li>
<li>Completar treinamento de segurança online</li>
</ol>

<h3>Novos Requisitos de Senha</h3>
<ul>
<li>Mínimo 12 caracteres</li>
<li>Pelo menos 1 letra maiúscula</li>
<li>Pelo menos 1 número</li>
<li>Pelo menos 1 caractere especial</li>
<li>Não pode ser similar às últimas 5 senhas</li>
</ul>

<p><strong>Importante:</strong> Funcionários que não cumprirem estes requisitos terão o acesso temporariamente suspenso até a regularização.</p>

<p>Em caso de dúvidas, contate o suporte técnico através do email: suporte@empresa.com</p>`,
      author: adminUser.name,
      authorId: adminUser.id,
      publishedAt: new Date()
    });

    // Mock Opportunity Article
    await this.createArticle({
      documentId: "opp001-senior-developer",
      title: "Vaga Aberta: Desenvolvedor Sênior - Equipe de Inovação",
      description: "Junte-se à nossa equipe de inovação como desenvolvedor sênior e ajude a construir o futuro da tecnologia",
      slug: "vaga-aberta-desenvolvedor-senior-equipe-inovacao",
      category: "opportunities",
      coverUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      coverAlt: "Equipe de desenvolvedores colaborando",
      content: "Estamos procurando um desenvolvedor sênior para nossa equipe de inovação. Requisitos: 5+ anos de experiência...",
      authorId: adminUser.id,
      publishedAt: new Date()
    });

    // Mock Service Article
    await this.createArticle({
      documentId: "service001-it-support",
      title: "Suporte Técnico 24/7 - Agora Disponível",
      description: "Nossa equipe de TI agora oferece suporte técnico 24 horas por dia, 7 dias por semana para emergências",
      slug: "suporte-tecnico-24-7-agora-disponivel",
      category: "services",
      coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
      coverAlt: "Central de atendimento técnico",
      content: "Nosso novo serviço de suporte técnico 24/7 está agora disponível para todos os funcionários...",
      authorId: adminUser.id,
      publishedAt: new Date()
    });
  }
}

export const storage = new MemStorage();
