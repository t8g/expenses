const path = require("path");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "../db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.path === "/expenseItems") {
    // transform query (limit => _limit, offset => _page)
    if (req.query.offset && req.query.limit) {
      req.query._page = Math.ceil(req.query.offset / req.query.limit) + 1;
      req.query._limit = req.query.limit;
    }
    // transform query (orderby => _sort & _order)
    if (req.query.orderby) {
      const sortInformations = req.query.orderby.split(",");
      req.query._sort = sortInformations[0];
      if (sortInformations.length > 0) req.query._order = sortInformations[1];
    }
    if (!req.query._sort) {
      req.query._sort = "createdAt";
      req.query._order = "asc";
    }
  }

  // add created and lastModified
  if (req.method === "POST") {
    req.body.createdAt = new Date().toISOString();
    req.body.lastModifiedAt = new Date().toISOString();
  }
  if (req.method === "PUT") {
    req.body.lastModifiedAt = new Date().toISOString();
  }
  next();
});

router.render = (req, res) => {
  if (Array.isArray(res.locals.data)) {
    // decorate array responses with items & count
    res.jsonp({
      items: res.locals.data,
      count: res.get("x-total-count") || res.locals.data.length
    });
  } else {
    res.jsonp(res.locals.data);
  }
};

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});
