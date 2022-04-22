const jsonServer = require("json-server");
const momentTZ = require("moment-timezone");
const { v4: uuid } = require("uuid");
const fsPromises = require("fs").promises;
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const db = require("./db.json");

const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use(
  jsonServer.rewriter({
    "/manage_schedule/api/v2/schedules?starttime=:startTime&endtime=:endTime":
      "/schedules?startTime=:startTime&endTime=:endTime",
  })
);

const getScheduledRecipes = () => {
  const p1 = momentTZ().add(-11, "hours").tz("America/New_York").valueOf();
  const f1 = momentTZ().add(12, "hours").tz("America/New_York").valueOf();
  const p2 = momentTZ().add(-10, "hours").tz("America/New_York").valueOf();
  const f2 = momentTZ().add(-4, "hours").tz("America/New_York").valueOf();
  const p3 = momentTZ().add(2, "hours").tz("America/New_York").valueOf();
  const f3 = momentTZ().add(8, "hours").tz("America/New_York").valueOf();
  const p4 = momentTZ().add(-8, "hours").tz("America/New_York").valueOf();
  const f4 = momentTZ().add(-2, "hours").tz("America/New_York").valueOf();
  const p5 = momentTZ().add(1, "hours").tz("America/New_York").valueOf();
  const f5 = momentTZ().add(10, "hours").tz("America/New_York").valueOf();

  const p6 = momentTZ().add(-3, "days").tz("America/New_York").valueOf();
  const f6 = momentTZ().add(-2, "days").tz("America/New_York").valueOf();

  const p7 = momentTZ().add(2, "days").tz("America/New_York").valueOf();
  const f7 = momentTZ().add(3, "days").tz("America/New_York").valueOf();

  const p8 = momentTZ().add(-2, "days").tz("America/New_York").valueOf();
  const f8 = momentTZ().add(2, "days").tz("America/New_York").valueOf();

  const pastArr = [p1, p2, p3, p4, p5];
  const futureArr = [f1, f2, f3, f4, f5];

  return { pastArr, futureArr };
};

const writeDBJSON = (query) => {
  try {
    const { pastArr, futureArr } = getScheduledRecipes();
    let currentSchedules = [...db.schedules];
    currentSchedules = currentSchedules.map((recipe, index) => ({
      ...recipe,
      id: uuid(),
      recipe_id: uuid(),
      recipe_name: `Recipe${uuid().substring(0, 4)}`,
      startTime: pastArr[index],
      endTime: futureArr[index],
    }));
    if (query.starttime && query.endtime) {
      const { starttime, endtime } = query;
      return currentSchedules.filter(
        (schedule) =>
          schedule.startTime >= +starttime && schedule.endTime <= +endtime
      );
    }
    return currentSchedules;

    // await fsPromises.writeFile(
    //   path.join(__dirname, "db.json"),
    //   JSON.stringify({ schedules: currentSchedules })
    // );
  } catch (error) {
    console.log("Error while writting to db.json ", error);
    return [];
  }
};

server.use(async (req, res, next) => {
  // await writeDBJSON();
  next();
});

router.render = async (req, res) => {
  //await writeDBJSON();
  const response = {};
  const results = writeDBJSON(req.query);
  response.count = results.length;
  response.result = res.locals.data;

  response.result = results;

  setTimeout(() => {
    res.jsonp(response);
  }, 1500);
};

// Use default router
server.use(router);
server.listen(3005, () => {
  console.log("\x1b[32m", "JSON Server Running on PORT 3005");
  console.log("\x1b[32m", "--------------------------------");
  console.log("\x1b[35m", "http://localhost:3005/schedules");
  //   console.log("\x1b[35m", "http://localhost:3002/inlets");
});
