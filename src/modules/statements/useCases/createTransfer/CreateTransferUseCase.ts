import { IStatementsRepository } from "../../../../modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "../../../../modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateTransferError } from "./CreateTransferError";


@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementRepository: IStatementsRepository
  ){}

  async transfer({id_received, id_send, amount, description}){
    const user = await this.usersRepository.findById(id_send)
    const userReceived = await this.usersRepository.findById(id_received)

    if(!user){
      throw new CreateStatementError.UserNotFound()
    }

    if(!userReceived){
      throw new CreateStatementError.UserNotFound()
    }

    const id_user = user.id;

    const statement = await this.statementRepository
      .findUserStatement(id_user)

    if(amount > statement.amount){
      throw new CreateTransferError.InsufficiendValue()
    }

    const valueTransfer = amount;

    const transfer = await this.statementRepository
      .transfer(id_send, valueTransfer, id_received, description)

    if(!transfer){
      throw new CreateTransferError.TransferOperationError()
    }

    return transfer

  }
}
