const jsonServer = require("json-server");
const { addHours } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");
const server = jsonServer.create();
const router = jsonServer.router("db.json");

const ny1 = new Date(
  formatInTimeZone(
    addHours(new Date(), -11),
    "America/New_York",
    "yyyy-MM-dd HH:mm:ss"
  )
).getTime();
const ny2 = new Date(
  formatInTimeZone(
    addHours(new Date(), 12),
    "America/New_York",
    "yyyy-MM-dd HH:mm:ss"
  )
).getTime();
const middlewares = jsonServer.defaults();
//moment().tz.setDefault("America/New_York");

server.use(middlewares);

server.use(
  jsonServer.rewriter({
    "/manage_schedule/api/v2/schedules?starttime=:startTime&endtime=:endTime":
      "/schedules?startTime_gte=:startTime&endTime_lte=:endTime",
  })
);

// server.use((req, res, next) => {

//   next();
// });

server.use(jsonServer.bodyParser);

router.render = (req, res) => {
  const response = {};
  response.result = res.locals.data;
  console.log("Inside ", ny1, ny2);
  response.result.push({
    id: 11,
    recipe_id: 102,
    recipe_name: "RecipeB",
    recipe_version: "v1",
    recipe_duration: 60,
    createdBy: "admin",
    createdDate: "12/28/2021",
    loop_count: 2,
    repeated: true,
    enabled: true,
    startTime: `${ny1}`,
    endTime: `${ny2}`,
  });
  setTimeout(() => {
    res.jsonp(response);
  }, 2500);
};

// Use default router
server.use(router);
server.listen(3005, () => {
  console.log("\x1b[32m", "JSON Server Running on PORT 3005");
  console.log("\x1b[32m", "--------------------------------");
  console.log("\x1b[35m", "http://localhost:3002/schedules");
  //   console.log("\x1b[35m", "http://localhost:3002/inlets");
});
