export const errorMiddleware = (err, _req, res, _next) => {
  console.error("Error:", err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong.",
  });
};
