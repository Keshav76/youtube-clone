const createError = (status = 500, message = "Something went wrong") => {
  return {
    status,
    message,
  };
};

export default createError;

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  const data = {
    success: false,
    status,
    message,
  };
  return res.status(status).json(data);
};
