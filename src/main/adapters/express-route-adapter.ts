import { Controller } from '@/presentation/protocols';
import { Request, Response } from 'express';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.headers || {}),
      ...(req.params || {}),
      accountId: req.accountId,
    };

    const httpResponse = await controller.handle(request);

    if (httpResponse.statusCode <= 399) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        statusCode: httpResponse.statusCode,
        error: httpResponse.body.message,
      });
    }
  };
};
