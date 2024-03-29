import { Request, Response, NextFunction } from 'express';

export const noCache = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.set(
    'cache-control',
    'np-store, no-cache, must-revalidate, proxy-revalidade',
  );
  res.set('pragma', 'no-cache');
  res.set('expires', '0');
  res.set('surrogate-control', 'no-store');
  next();
};
