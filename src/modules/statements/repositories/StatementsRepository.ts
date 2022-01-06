import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });



    return this.repository.save(statement);
  }

  async transfer(
    idSend: string,
    valueTransfer: number,
    idReceived: string,
    description: string
  ): Promise<ICreateTransferDTO> {

    const sendedTransfer = await this.sendTransfer(
      idSend,
      valueTransfer
    )

    const receivedTransfer = await this.receiveTransfer(
      idReceived,
      valueTransfer
    )

    if(!sendedTransfer) return

    return {
      id: idSend,
      sender_id: idReceived,
      amount: valueTransfer,
      description: description,
      type: "transfer",
      created_at: receivedTransfer.created_at,
      updated_at: receivedTransfer.updated_at
    }


  }

  async sendTransfer(
    idSend: string,
    valueTransfer: number
  ) {
    const statementSend = await this.repository.findOne({where: {user_id: idSend}})

    const amountNow = statementSend.amount;

    const statement = await this.repository.update(
      {
        id: statementSend.id
      },{
        amount: (amountNow - valueTransfer)
      }
    )


    if(!statement) return null;

    return statement

  }

  async receiveTransfer(
    idReceived: string,
    amount: number
  ){
    const statementReceived = await this.repository.findOne({where: {user_id: idReceived}})

    const amountNow = statementReceived.amount;

    const transfer = await this.repository.update(
      {
        id: statementReceived.id
      },{
        amount: (Number(amountNow) + amount)
      }
    )

    if(!transfer) return null;

    const statementReceivedUpdated = await this.repository.findOne({where: {user_id: idReceived}})

    return statementReceivedUpdated

  }


  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async findUserStatement(id: String): Promise<Statement>{
    const statementUser = await this.repository.findOne({
      where: {user_id: id}
    })



    if(!statementUser) return null

    return statementUser

  }
}
