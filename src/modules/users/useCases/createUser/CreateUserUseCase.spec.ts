import { InMemoryUsersRepository } from "modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { IUsersRepository } from "../../repositories/IUsersRepository"

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("should be able to create a user", async () => {
    const response = await createUserUseCase.execute({
      name: "test",
      email: "test@test.com",
      password: "123456"
    })

    expect(response).toHaveProperty("id")
  });

  it("should not be able to create a duplicated user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user1",
        email: "user@email.com",
        password: "123456"
      })

      await createUserUseCase.execute({
        name: "user2",
        email: "user@email.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
