import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from '../createTransfer/CreateTransferUseCase';

export class CreateTransferController {
  async transfer(req: Request, res: Response) {
    const {user_id: id_transfer} = req.params;
    const {amount, description} = req.body;
    const { id } = req.user;

    const createTransfer = container.resolve(CreateTransferUseCase)

    const transfer = await createTransfer.transfer({
      amount,
      description,
      id_send: id,
      id_received: id_transfer
    })
    console.log(transfer)

    return res.status(201).json({transfer})
  }
}
