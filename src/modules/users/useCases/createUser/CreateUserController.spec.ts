import { app } from "app";
import { hash } from "bcryptjs"
import request from "supertest"
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../../../../database";

let connection: Connection;

describe("CreateUserController", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("should be able to create an user", async () => {
    const response = await request(app).post("/api/v1/users/").send({
      name: "Alcantra",
      email: "alcantra@gmail.com",
      password: "123456"
    })

    expect(response.status).toBe(201)
  })
})
