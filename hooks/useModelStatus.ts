'use client';

import { useSyncExternalStore } from 'react';
import { getModelStatus, subscribeModelStatus } from '../lib/embeddings';

const serverStatus = { state: 'idle', progress: 0 } as const;

export function useModelStatus() {
  return useSyncExternalStore(subscribeModelStatus, getModelStatus, () => serverStatus);
}