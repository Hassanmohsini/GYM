const errorHandler = (err, req, res, next) => {
  // check if the status code is not successful (200) assign a custom status code otherwise 500
  console.log("ERROR MIDDLEWARE");
  // console.log(res.statusCode);
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // once I have my custom status code I will send a response

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
