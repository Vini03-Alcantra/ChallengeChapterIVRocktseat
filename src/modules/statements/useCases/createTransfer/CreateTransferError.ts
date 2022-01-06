import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class InsufficiendValue extends AppError {
    constructor(){
      super('Value Insufficient', 401)
    }
  }

  export class TransferOperationError extends AppError{
    constructor(){
      super('Operação deu erro. Tente novamente. Caso o erro persista contate o suporte', 401)
    }
  }
}
