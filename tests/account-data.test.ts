import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { createStore } from 'zustand/vanilla';

register('./helpers/api-loader.mjs', import.meta.url);
const { createMessageSlice } = await import('../src/lib/slices/messageSlice.ts');
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

function store() {
  return createStore<any>((set, get, api) => ({
    chats: [], activeId: null, model: { id: 'stale', label: 'Old account' }, language: 'en',
    ...createMessageSlice(set, get, api),
    selectChat: async (id: string) => {
      set({ activeId: id });
      await get()._fetchMessages(id);
    },
  }));
}

test('account hydration restores database language and model preferences', async () => {
  globalThis.fetch = async (url: any) => Response.json(String(url) === '/api/settings'
    ? { language: 'ja', model: 'neco-ai-1.0' } : []);
  const app = store();
  await app.getState()._fetchInitialData();
  assert.equal(app.getState().language, 'ja');
  assert.equal(app.getState().model.id, 'neco-ai-1.0');
});

test('an aborted account load cannot restore the previous user\'s history', async () => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  globalThis.fetch = async () => {
    await gate;
    return Response.json([{ id: 'old-account-chat', messages: [] }]);
  };
  const app = store();
  const account = new AbortController();
  const pending = app.getState()._fetchInitialData(account.signal);
  account.abort();
  release();
  await pending;
  assert.deepEqual(app.getState().chats, []);
  assert.equal(app.getState().activeId, null);
  assert.equal(app.getState().error, null);
});

test('reopening a cached chat reads messages written by another device', async () => {
  const app = store();
  app.setState({ chats: [{ id: 'shared', messages: [{ id: 'old', content: 'Old message' }] }] });
  globalThis.fetch = async () => Response.json([
    { id: 'old', content: 'Old message' }, { id: 'phone', content: 'From phone' },
  ]);
  await app.getState()._fetchMessages('shared');
  assert.equal(app.getState().chats[0].messages.at(-1).content, 'From phone');
});

test('refreshing history does not overwrite locally streaming text', async () => {
  const app = store();
  app.setState({ isStreaming: true, chats: [{ id: 'shared', messages: [{ id: 'draft', content: 'Working...' }] }] });
  globalThis.fetch = async () => { throw new Error('A streaming chat must not be replaced'); };
  await app.getState()._fetchMessages('shared');
  assert.equal(app.getState().chats[0].messages[0].content, 'Working...');
});

test('a history request already in flight cannot overwrite a newly started response', async () => {
  const app = store();
  app.setState({ chats: [{ id: 'shared', messages: [] }] });
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  globalThis.fetch = async () => {
    await gate;
    return Response.json([{ id: 'old', content: 'Stale snapshot' }]);
  };
  const pending = app.getState()._fetchMessages('shared');
  app.setState({ isStreaming: true, chats: [{ id: 'shared', messages: [{ id: 'draft', content: 'New response' }] }] });
  release();
  await pending;
  assert.equal(app.getState().chats[0].messages[0].content, 'New response');
});
