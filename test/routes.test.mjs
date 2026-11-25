import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, mkdir, writeFile, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { apply } from '../index.js'

const docId = 'a'.repeat(24)
let handler
let origin = ''
let server
let home

before(async () => {
  home = await mkdtemp(join(tmpdir(), 'deepread-routes-'))
  process.env.DSH_HOME = home
  const root = join(home, 'deepread')
  await mkdir(join(root, 'text', `${docId}.words`), { recursive: true })
  // the stored shape: a page index plus one word file per page
  await writeFile(join(root, 'text', `${docId}.json`), JSON.stringify([
    { width: 612, height: 792, text: 'Hello world' },
    { width: 612, height: 792, text: 'Second page' },
  ]))
  await writeFile(join(root, 'text', `${docId}.words`, '1.json'), JSON.stringify([[72, 100, 120, 112, 'Hello']]))
  await writeFile(join(root, 'text', `${docId}.meta.json`), JSON.stringify({ id: docId, name: 'book.pdf', title: 'Book', pages: 2 }))
  apply({
    webServer: { register: (options) => { handler = options.handler; return () => {} }, getOrigin: () => origin },
    web: { search: async () => ({ content: '', sources: [] }) },
    agents: { get: () => undefined },
    logger: { warn: () => {} },
    effect: (fn) => fn(),
  })
  server = createServer((request, response) => handler(request, response))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  origin = `http://127.0.0.1:${server.address().port}`
})

after(() => { server?.close() })

const api = (path) => `${origin}/dsh-deepread/api${path}`
const postJson = (path, body) => fetch(api(path), {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-dsh-deepread': '1' },
  body: JSON.stringify(body),
})

test('page words come from their own file', async () => {
  const response = await fetch(api(`/text/${docId}/1`))
  assert.equal(response.status, 200)
  const value = await response.json()
  assert.deepEqual(value.words, [[72, 100, 120, 112, 'Hello']])

  // the index on disk carries no word boxes
  const index = JSON.parse(await readFile(join(home, 'deepread', 'text', `${docId}.json`), 'utf8'))
  assert.equal(index.length, 2)
  assert.equal(index[0].words, undefined)
  assert.equal(index[1].text, 'Second page')
})

test('/doc returns page texts and the page count', async () => {
  const value = await (await fetch(api(`/doc/${docId}`))).json()
  assert.equal(value.pages, 2)
  assert.equal(value.texts.length, 2)
  assert.equal(value.texts[0].text, 'Hello world')
})

test('a page without a text layer answers with no words', async () => {
  const value = await (await fetch(api(`/text/${docId}/2`))).json()
  assert.deepEqual(value.words, [])
})

test('HEAD returns the headers without a body', async () => {
  const response = await fetch(api(`/doc/${docId}`), { method: 'HEAD' })
  assert.equal(response.status, 200)
  assert.ok(Number(response.headers.get('content-length')) > 0)
  assert.equal(await response.text(), '')
})

test('highlights are added, edited and removed', async () => {
  const added = await (await postJson('/annotations', {
    docId,
    op: 'add',
    item: { page: 1, boxes: [{ x: 0.1, y: 0.2, w: 0.3, h: 0.01 }], text: 'Hello' },
  })).json()
  assert.equal(added.items.length, 1)
  const id = added.items[0].id

  const updated = await (await postJson('/annotations', { docId, op: 'update', id, patch: { note: 'note', color: 'green' } })).json()
  assert.equal(updated.items[0].note, 'note')
  assert.equal(updated.items[0].color, 'green')

  const removed = await (await postJson('/annotations', { docId, op: 'remove', id })).json()
  assert.equal(removed.items.length, 0)
})

test('the page proxy refuses an internal target before fetching', async () => {
  const response = await fetch(api(`/page?url=${encodeURIComponent('http://169.254.169.254/')}`))
  assert.equal(response.status, 400)
  assert.match(await response.text(), /not allowed/)
})

test('documents lists the file and removes it with its pages', async () => {
  const list = await (await fetch(api('/documents'))).json()
  assert.ok(list.items.some((row) => row.id === docId))

  const removed = await postJson('/documents/remove', { id: docId })
  assert.equal(removed.status, 200)

  assert.equal((await fetch(api(`/doc/${docId}`))).status, 404)
  assert.equal((await fetch(api(`/text/${docId}/1`))).status, 404)
})
