import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      const result: HttpResponse = {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
      return result;
    }

    if (!httpRequest.body.email) {
      const result: HttpResponse = {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
      return result;
    }

    return {
      statusCode: 400,
      body: new Error('Request inválid'),
    };
  }
}
