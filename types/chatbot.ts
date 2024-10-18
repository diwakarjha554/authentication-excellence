export interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatbotSession {
  _id: string;
  userId: string;
  title: string;
  messages: Message[];
  lastInteraction: Date;
  status: 'active' | 'archived';
}