import { hash } from "bcryptjs";

import { InMemoryUsersRepository } from "modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import {IUsersRepository} from "../../repositories/IUsersRepository"

let usersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", async () => {
  await usersRepository.create({
    email: "test@test.com",
    name: "test",
    password: await hash("123456", 8)
  });

  const response = await authenticateUserUseCase.execute({
    email: "test@test.com",
    password: "non-existent"
  })

  expect(response).toHaveProperty("token")
  expect(response).toHaveProperty("user")
});

it("should not be able to authenticate with a non-existent user", async () => {
  expect(async () => {
    await authenticateUserUseCase.execute({
      email: "non@existent.com",
      password: "non-existent"
    })
  }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
})

it("should not be able to authenticate with a wrong password", async () => {
  expect(async () => {
    await usersRepository.create({
      email: "test@test.com",
      name: "test",
      password: await hash("123456", 8)
    })

    const response = await authenticateUserUseCase.execute({
      email: "non@existent.com",
      password: "123456"
    })
  }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
})
