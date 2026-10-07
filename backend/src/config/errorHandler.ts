export const handleErrors = (err: any, req: any, res: any, next: any) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({
    timestamp: new Date().toISOString(),
    status,
    code: err.code || 'INTERNAL_ERROR',
    message,
    fieldErrors: err.fieldErrors || []
  });
};
