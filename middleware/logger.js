/**
 * Request Logger Middleware
 * Logs details about incoming requests and their responses
 */
const requestLogger = (req, res, next) => {

  const startTime = new Date();
  const timestamp = startTime.toISOString();
  
  console.log(`\n[${timestamp}] REQUEST: ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  const originalSend = res.send;
  const originalJson = res.json;
  const originalEnd = res.end;
  
  res.send = function (body) {
    if (!res._isResponseLogged) {
      const endTime = new Date();
      const processingTime = endTime - startTime;
      console.log(`[${endTime.toISOString()}] RESPONSE: ${res.statusCode} (${processingTime}ms)`);
      res._isResponseLogged = true;
    }
    return originalSend.call(this, body);
  };
  
  res.json = function (body) {
    if (!res._isResponseLogged) {
      const endTime = new Date();
      const processingTime = endTime - startTime;
      console.log(`[${endTime.toISOString()}] RESPONSE: ${res.statusCode} (${processingTime}ms)`);
      res._isResponseLogged = true;
    }
    return originalJson.call(this, body);
  };
  
  res.end = function (chunk) {
    if (!res._isResponseLogged) {
      const endTime = new Date();
      const processingTime = endTime - startTime;
      console.log(`[${endTime.toISOString()}] RESPONSE: ${res.statusCode} (${processingTime}ms)`);
      res._isResponseLogged = true;
    }
    return originalEnd.call(this, chunk);
  };
  
  next();
};

/**
 * Body Logger Middleware
 * Logs request body for methods that typically include a body
 * Must be used after express.json() middleware
 */
const bodyLogger = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
};

module.exports = {
  requestLogger,
  bodyLogger
};