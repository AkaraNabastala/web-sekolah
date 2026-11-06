// Domain models: messages

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean | number;
  reply_status: 'unread' | 'read' | 'replied';
  notes?: string;
  created_at: string;
}
