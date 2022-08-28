export const badRequest = {
  description: 'Invalid Requesition',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
};
