// Middleware de log — registra todas as requisições no terminal
module.exports = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} - ${req.url}`);
  next();
};