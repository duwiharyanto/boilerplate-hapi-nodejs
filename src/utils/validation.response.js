const handleValidationFailure = (request, h, error) => {
  const response = {
    statusCode: 400,
    error: 'Bad Request',
    message: 'Data validasi gagal',
    details: error.details.map((detail) => detail.message),
  };

  return h.response(response).code(response.statusCode);
};
const handleException = (h, error) => {
  const response = {
    statusCode: 400,
    error: 'Bad Request',
    message: 'Sistem error',
    details: error.message,
  };

  return h.response(response).code(response.statusCode);
};
module.exports = { handleValidationFailure, handleException };
