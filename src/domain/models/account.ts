export type AccountModel = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AddAccountParamsModel = Omit<AccountModel, 'id'>;
