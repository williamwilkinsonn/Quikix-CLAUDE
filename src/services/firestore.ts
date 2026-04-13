/**
 * Firestore Service
 *
 * Provides typed helpers for common Firestore operations.
 * Collections: users, projects, conversations
 */
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '@/config/firebase';
import type { Project, Conversation, UserProfile } from '@/types';

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * Create or merge a user document in Firestore.
 * Called on first sign-up or Google sign-in.
 */
export async function createUserDocument(
  user: User,
  extraData: Partial<UserProfile> = {}
): Promise<void> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? extraData.displayName ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
      ...extraData,
    });
  }
}

/**
 * Fetch a user's profile document.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

/**
 * Update a user's profile document.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data as DocumentData);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Subscribe to all projects owned by the current user.
 * Returns an unsubscribe function to clean up the listener.
 */
export function subscribeToProjects(
  uid: string,
  callback: (projects: Project[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'projects'),
    where('ownerUid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    callback(projects);
  });
}

/**
 * Create a new project.
 */
export async function createProject(
  uid: string,
  data: Omit<Project, 'id' | 'ownerUid' | 'createdAt'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Delete a project by ID.
 */
export async function deleteProject(projectId: string): Promise<void> {
  await deleteDoc(doc(db, 'projects', projectId));
}

// ─── Conversations ────────────────────────────────────────────────────────────

/**
 * Subscribe to all conversations for the current user.
 */
export function subscribeToConversations(
  uid: string,
  callback: (conversations: Conversation[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const conversations = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() } as Conversation)
    );
    callback(conversations);
  });
}

/**
 * Create a new conversation.
 */
export async function createConversation(
  participants: string[],
  title: string
): Promise<string> {
  const ref = await addDoc(collection(db, 'conversations'), {
    participants,
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  });
  return ref.id;
}
