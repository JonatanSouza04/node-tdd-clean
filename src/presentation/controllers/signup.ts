import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../erros/missing-param-error';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      const result: HttpResponse = {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
      return result;
    }

    if (!httpRequest.body.email) {
      const result: HttpResponse = {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
      return result;
    }

    return {
      statusCode: 400,
      body: new MissingParamError('Request inválid'),
    };
  }
}
