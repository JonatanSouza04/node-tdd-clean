import { apiKeyAuthSchema } from '@/main/docs/schemas/api-key-auth-schema';
import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
} from '@/main/docs/components/';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
};
