/**
 * Shared TypeScript types for Quikix
 */

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL: string;
  createdAt: unknown; // Firestore Timestamp
}

export interface Project {
  id: string;
  ownerUid: string;
  title: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: unknown; // Firestore Timestamp
}

export interface Conversation {
  id: string;
  participants: string[];
  title: string;
  lastMessage: string | null;
  createdAt: unknown;
  updatedAt: unknown;
}
