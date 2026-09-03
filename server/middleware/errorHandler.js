module.exports = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
};
