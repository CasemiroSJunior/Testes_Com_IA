import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import http from 'http'
import app from '../src/app'
import prisma from '../src/prisma'

type User = { id: number; email: string | null; name: string; success?: boolean }

describe('Testa rotas da API de usuários', () => {
  let server: http.Server
  let port: number
  let ENDPOINT: string

  beforeAll(async () => {
    await prisma.prompt.deleteMany();
    await prisma.user.deleteMany(); // Aqui ele limpa o banco para n dar problemas nos testes definidos

    server = http.createServer(app)
    await new Promise<void>((resolve) => server.listen(0, resolve))
    const address = server.address()
    port = typeof address === 'string' || address === null ? 0 : address.port
    ENDPOINT = `http://127.0.0.1:${port}/api/users`
  })

  afterAll(async () => {
    server.close()
  })

  it('POST | Cria usuário com email e retorna 201', async () => {
    const data = { name: 'Alice', email: 'alice@example.com' }
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.name).toBe('Alice')
    expect(body.email).toBe('alice@example.com')
    expect(typeof body.id).toBe('number')
    expect(body.success).toBeTruthy()
  })

  it('POST | Cria usuário com id fornecido', async () => {
    const data = { id: 12345, name: 'Bob', email: 'bob@example.com' }
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe(12345)
    expect(body.name).toBe('Bob')
  })

  it('POST | Cria usuário sem email (email nulo)', async () => {
    const data = { name: 'Charlie' }
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.email).toBeNull()
  })

  it('GET | busca usuário por id', async () => {
    const params = { name: 'Dan', email: 'dan@example.com' }
    const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
    const created = await res.json()

    const res2 = await fetch(`${ENDPOINT}/${created.id}`)
    expect(res2.status).toBe(200)
    const user = await res2.json() as User
    expect(user.id).toBe(created.id)
    expect(user.name).toBe('Dan')
  })

  it('PUT | atualiza usuário e retorna o usuário atualizado', async () => {
    const params = { name: 'Ed', email: 'ed@example.com' }
    const r1 = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
    const created = await r1.json()
    const updatedUser = { name: 'Eddard', email: 'eddard@example.com' }
    const res2 = await fetch(`${ENDPOINT}/${created.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedUser) })
    expect(res2.status).toBe(200)
    const resUpdated = await res2.json()
    expect(resUpdated.name).toBe('Eddard')
    expect(resUpdated.email).toBe('eddard@example.com')
    expect(resUpdated.success).toBeTruthy()
  })

  it('GET | lista usuários e retorna array', async () => {
    const res = await fetch(ENDPOINT)
    expect(res.status).toBe(200)
    const list = await res.json() as User[]
    expect(Array.isArray(list)).toBeTruthy()
  })

  it('DELETE | deleta usuário e retorna sucesso', async () => {
    const params = { name: 'Finn', email: 'finn@example.com' }
    const res1 = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
    const created = await res1.json() as any

    const res2 = await fetch(`${ENDPOINT}/${created.id}`, { method: 'DELETE' })
    expect(res2.status).toBe(200)
    const body = await res2.json() as any
    expect(body.success).toBeTruthy()

    const res3 = await fetch(`${ENDPOINT}/${created.id}`)
    expect(res3.status).toBe(404)
  })

  it('DELETE/PUT | retorna 404 para update/delete em usuário inexistente', async () => {
    const res1 = await fetch(`${ENDPOINT}/9999`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'X' }) })
    expect(res1.status).toBe(404)
    const res2 = await fetch(`${ENDPOINT}/9999`, { method: 'DELETE' })
    expect(res2.status).toBe(404)
  })
})
