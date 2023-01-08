const { Router } = require("express");
const router = Router();
const fetch = require("node-fetch");
const { Stage, Session } = require("../db");
const { Op } = require("sequelize");

router.post("/", async (req, res) => {
  try {
    const { code, userId } = req.body;

    const response = await fetch(
      `https://api.fitbit.com/oauth2/token?client_id=238Z55&code=${code}&code_verifier=48601r4939480m540t0v3p6b3z3a4l323s0a6f0q0t4e1e0y133809063f1q2n425j362z0k5t1c1p0m6u2d4w3a6b4p2j4z2f175u182t5p6n576h2p3e2b5j090g68&grant_type=authorization_code`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic MjM4WjU1OmIyYmI2ZDQxNTljODVjZTBkZjYxY2ExN2EwMTJlYzM2",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const getToken = await response.json();

    const token = await getToken.access_token;

    //searches for most recent timestamp

    const mostRecent = await Session.findOne({
      where: {
        createdAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    if (!mostRecent) {
      //if no recent timestamp, adds data from the last 100 days
      const endDate = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
      console.log("100endDate", endDate);
      const startDate = new Date(Date.now() - 8640000000)
        .toISOString()
        .split("T")[0];
      console.log("100startDate", startDate);

      const data = await fetch(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${startDate}/${endDate}.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const getData = await data.json();
      console.log("dataNORECENT", getData);

      const sessions = getData.sleep?.map((d) => {
        let obj = {};
        obj["log_id"] = d.logId;
        obj["date"] = d.dateOfSleep;
        obj["start_time"] = d.startTime;
        obj["end_time"] = d.endTime;
        obj["duration"] = d.duration;
        obj["efficiency"] = d.efficiency;
        obj["summary_deep_min"] = d?.levels?.summary?.deep?.minutes;
        obj["summary_light_min"] = d?.levels?.summary?.light?.minutes;
        obj["summary_rem_min"] = d?.levels?.summary?.rem?.minutes;
        obj["summary_awake_min"] = d?.levels?.summary?.wake?.minutes;
        return obj;
      });
      console.log("sessions", sessions);
      const sessionInstance = await Session.bulkCreate(sessions);
      // await sessionInstance.setUser(userId);

      const stages = getData.sleep
        ?.map((stage) => {
          return stage?.levels?.data?.map((s) => {
            let obj = {};
            obj["date"] = s.dateTime.split("T")[0];
            obj["time"] = s.dateTime.split("T")[1].split(".")[0];
            obj["level"] = s.level;
            obj["seconds"] = s.seconds;
            return obj;
          });
        })
        .flat(2);
      // console.log("stages", stages);

      const stagesInstance = await Stage.bulkCreate(stages);
      // await stagesInstance.setUser(userId);
    } else {
      // if there's a recent timestamp, then adds from the past 12h to today
      const today = mostRecent?.dataValues?.createdAt
        .toISOString()
        .split("T")[0];
      console.log("recenttoday", today);

      const startDate = new Date(Date.now() - 43200000)
        .toISOString()
        .split("T")[0];
      console.log("recentstartDate", startDate);

      const data = await fetch(
        `https://api.fitbit.com/1.2/user/-/sleep/date/${today}/${startDate}.json`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const getData = await data.json();
      console.log("recentDATA", getData);

      const sessions = getData.sleep?.map((d) => {
        let obj = {};
        obj["log_id"] = d.logId;
        obj["date"] = d.dateOfSleep;
        obj["start_time"] = d.startTime;
        obj["end_time"] = d.endTime;
        obj["duration"] = d.duration;
        obj["efficiency"] = d.efficiency;
        obj["summary_deep_min"] = d?.levels?.summary?.deep?.minutes;
        obj["summary_light_min"] = d?.levels?.summary?.light?.minutes;
        obj["summary_rem_min"] = d?.levels?.summary?.rem?.minutes;
        obj["summary_awake_min"] = d?.levels?.summary?.wake?.minutes;
        return obj;
      });
      console.log("sessions", sessions);
      const sessionInstance = await Session.bulkCreate(sessions);
      // await sessionInstance.setUser(userId);

      const stages = getData.sleep
        ?.map((stage) => {
          return stage?.levels?.data?.map((s) => {
            let obj = {};
            obj["date"] = s.dateTime.split("T")[0];
            obj["time"] = s.dateTime.split("T")[1].split(".")[0];
            obj["level"] = s.level;
            obj["seconds"] = s.seconds;
            return obj;
          });
        })
        .flat(2);
      console.log("stages", stages);
      const stagesInstance = await Stage.bulkCreate(stages);
      // await stagesInstance.setUser(userId);
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
