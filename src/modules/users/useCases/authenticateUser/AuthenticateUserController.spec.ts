import { app } from "app";
import createConnection from "../../../../database"

import { hash } from "bcryptjs";
import { request } from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("AuthenticateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection()

    const id = uuidV4()
    const password = await hash("123456", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      VALUES('${id}', 'admin', 'admin@finapi.com.br', '${password}', 'now()', 'now()')`
    )
  })

afterAll(async () => {
  await connection.dropDatabase()
  await connection.close()
})

it("should not be able to authenticate", async () => {
  const response = await request(app).post("/api/v1/sessions").send({
    email: "admin@finapi.com.br",
    password: "admin"
  })

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty("token")
})

it("should not be able to authenticate with wrong password", async () => {
  const response = await request(app).post("/api/v1/sessions").send({
    email: "wrong@email.com.br",
    password: "admin"
  })

  expect(response.status).toBe(401)
})

it("should not be able to authenticate with wrong email", async () => {
  const response = await request(app).post("/api/v1/sessions").send({
    email: "wrong@email.com.br",
    password: "admin"
  })

  expect(response.status).toBe(401)
})
})
