exports.triggerError = (req, res, next) => {
  // Intentionally throw an error
  const err = new Error("Intentional 500 error triggered for testing!");
  err.status = 500;
  next(err);
};