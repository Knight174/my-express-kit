const fn1 = (req, res, next) => {
  const title = res.app.locals.title;
  console.log("app.locals.title => ", title);
  next();
};

module.exports = fn1;
