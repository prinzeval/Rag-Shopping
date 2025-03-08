// types.ts
export interface Message {
    text: string;
    type: 'customer' | 'agent';
    time: string;
  }
  
  export type Conversations = Record<string, Message[]>;