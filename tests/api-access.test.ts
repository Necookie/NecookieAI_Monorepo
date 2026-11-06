import { after, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register('./helpers/api-loader.mjs', import.meta.url);

const { client } = await import('./helpers/database.ts');
const chats = await import('../src/pages/api/chats/index.ts');
const messageList = await import('../src/pages/api/chats/[id]/messages.ts');
const messages = await import('../src/pages/api/messages/index.ts');
const preferences = await import('../src/pages/api/settings/index.ts');
const truncate = await import('../src/pages/api/messages/truncate.ts');
const update = await import('../src/pages/api/chats/update.ts');
const remove = await import('../src/pages/api/chats/delete.ts');

function context(userId: string | null, body?: object, params: Record<string, string> = {}) {
  return {
    locals: { auth: () => ({ userId }) },
    request: new Request('https://test.invalid/api/chats/delete?id=alice-chat', {
      method: body ? 'POST' : 'GET',
      ...(body ? { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } } : {}),
    }),
    params,
  } as any;
}

beforeEach(async () => {
  await client.executeMultiple('DELETE FROM messages; DELETE FROM chats; DELETE FROM settings;');
  await chats.POST(context('alice', { id: 'alice-chat', title: 'From desktop' }));
  await messages.POST(context('alice', {
    id: 'alice-message', chatId: 'alice-chat', role: 'user', content: 'Desktop message',
    timestamp: '2026-11-07T00:00:00.000Z',
  }));
});
after(() => client.close());

test('every data handler rejects a signed-out request', async () => {
  const handlers = [chats.GET, chats.POST, messageList.GET, messages.POST,
    preferences.GET, preferences.POST, truncate.POST, update.PATCH, remove.DELETE];
  for (const handler of handlers) {
    const res = await handler(context(null, {}, { id: 'alice-chat' }));
    assert.equal(res.status, 401);
  }
});

test('desktop and mobile identities for the same account read and write the same records', async () => {
  // Separate request contexts model two clients, not two separate user accounts.
  const mobile = context('alice', undefined, { id: 'alice-chat' });
  assert.equal((await (await chats.GET(mobile)).json())[0].title, 'From desktop');
  assert.equal((await (await messageList.GET(mobile)).json())[0].content, 'Desktop message');
  assert.equal((await messages.POST(context('alice', {
    id: 'mobile-message', chatId: 'alice-chat', role: 'user', content: 'Phone message',
    timestamp: '2026-11-07T00:01:00.000Z',
  }))).status, 201);
  const desktop = await messageList.GET(context('alice', undefined, { id: 'alice-chat' }));
  assert.deepEqual((await desktop.json()).map((m: any) => m.content), ['Desktop message', 'Phone message']);
  await preferences.POST(context('alice', { language: 'ja', model: 'neco-ai-1.0' }));
  assert.equal((await (await preferences.GET(context('alice'))).json()).language, 'ja');
});

test('another account cannot list or read the owner\'s chats and messages', async () => {
  assert.deepEqual(await (await chats.GET(context('bob'))).json(), []);
  assert.deepEqual(await (await preferences.GET(context('bob'))).json(), {});
  const res = await messageList.GET(context('bob', undefined, { id: 'alice-chat' }));
  assert.equal(res.status, 404);
  assert.equal(JSON.stringify(await res.json()).includes('Desktop message'), false);
});

test('a colliding chat ID cannot rename another account\'s conversation', async () => {
  const res = await chats.POST(context('bob', { id: 'alice-chat', title: 'Unauthorized rename' }));
  assert.equal(res.status, 403);
  assert.equal((await (await chats.GET(context('alice'))).json())[0].title, 'From desktop');
});

test('another account cannot append, truncate, pin, or delete the owner\'s chat', async () => {
  assert.equal((await messages.POST(context('bob', {
    id: 'injected', chatId: 'alice-chat', role: 'assistant', content: 'Injected',
  }))).status, 403);
  assert.equal((await truncate.POST(context('bob', {
    chatId: 'alice-chat', timestamp: '2026-01-01T00:00:00.000Z',
  }))).status, 403);
  await update.PATCH(context('bob', { id: 'alice-chat', pinned: true, folder: 'Stolen' }));
  assert.equal((await remove.DELETE(context('bob'))).status, 404);
  const owned = (await (await chats.GET(context('alice'))).json())[0];
  assert.equal(owned.pinned, false);
  assert.equal(owned.folder, null);
  assert.equal((await (await messageList.GET(context('alice', undefined, { id: 'alice-chat' }))).json()).length, 1);
});

test('the owner can rename an existing conversation', async () => {
  assert.equal((await chats.POST(context('alice', { id: 'alice-chat', title: 'Updated from phone' }))).status, 201);
  assert.equal((await (await chats.GET(context('alice'))).json())[0].title, 'Updated from phone');
});
