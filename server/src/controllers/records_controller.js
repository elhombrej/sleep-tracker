const { Op } = require("sequelize");
const {
  NewRecord,
  CoffeeSize,
  AlcoholType,
  Activity,
  User,
} = require("../db.js");
const { time_convert } = require("../helpers/time_convert.js");
const { tConvert } = require("../helpers/convert_24_to_12hrs.js");

/* ================== Get List All Records =================== */

const getRecords = async (req, res) => {
  const finalResult = [];
  const { id, date } = req.query;

  if (!id && !date) {
    try {
      const recordsRes = await NewRecord.findAll({
        include: [
          {
            model: CoffeeSize,
            attributes: ["size"],
            through: { attributes: [] },
          },
          {
            model: AlcoholType,
            attributes: ["drink"],
            through: { attributes: [] },
          },
          {
            model: Activity,
            attributes: ["activity"],
            through: { attributes: [] },
          },
          {
            model: User,
          },
        ],
        /* include: [
          {
            all: true,
          },
        ], */
      });

      if (recordsRes.length < 1) {
        return res.status(200).json({ message: `No existen registros` });
      }

      for (let i = 0; i < recordsRes.length; i++) {
        let joinActivity = [];
        let timeActivity = "";
        let typeActivity = "";
        let joinCoffee = [];
        let coffeeCups = "";
        let coffeeSizes = "";
        let joinDrinks = [];
        let quantityDrinks = "";
        let typeDrinks = "";

        if (recordsRes[i].timeActivity.length >= 1) {
          timeActivity = recordsRes[i].timeActivity.flat();
          typeActivity = recordsRes[i].activities.map(e => e.activity).flat();

          for (let i = 0; i < timeActivity.length; i++) {
            joinActivity.push(`${timeActivity[i]} min de ${typeActivity[i]}`);
          }
        }

        if (recordsRes[i].coffeeCups.length >= 1) {
          coffeeCups = recordsRes[i].coffeeCups.flat();
          coffeeSizes = recordsRes[i].coffeeSizes.map(e => e.size).flat();

          for (let i = 0; i < coffeeCups.length; i++) {
            coffeeCups[i] > 1
              ? joinCoffee.push(`${coffeeCups[i]} tazas de ${coffeeSizes[i]}`)
              : joinCoffee.push(`${coffeeCups[i]} taza de ${coffeeSizes[i]}`);
          }
        }

        if (recordsRes[i].drinks.length >= 1) {
          quantityDrinks = recordsRes[i].drinks.flat();
          typeDrinks = recordsRes[i].alcoholTypes.map(e => e.drink).flat();

          for (let i = 0; i < quantityDrinks.length; i++) {
            quantityDrinks[i] > 1
              ? joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}s`)
              : joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}`);
          }
        }

        let obj = {
          id: recordsRes[i].id,
          userId: recordsRes[i].userId,
          dateMeal: recordsRes[i].dateMeal,
          timeMeal: tConvert(recordsRes[i].timeMeal),
          description:
            recordsRes[i].description === ""
              ? "sin registro"
              : recordsRes[i].description,
          sleepTime: `${time_convert(recordsRes[i].sleepTime)}`,
          napTime:
            recordsRes[i].napTime.length < 1
              ? "sin registro"
              : recordsRes[i].napTime.map(e => `${e} min. de siesta`),
          activities: joinActivity.length < 1 ? "sin registro" : joinActivity,
          coffees: joinCoffee.length < 1 ? "sin registro" : joinCoffee,
          drinks: joinDrinks.length < 1 ? "sin registro" : joinDrinks,
        };
        finalResult.push(obj);
      }
      res.status(200).json(finalResult);
    } catch (err) {
      return res.status(400).json(err);
    }
  } else {
    const finalResultId = [];
    try {
      const resDb = await NewRecord.findAll({
        include: [{ all: true }],
        where: {
          /* userId: id,
        dateMeal: date, */
          [Op.and]: [{ userId: id, dateMeal: date }],
        },
      });

      if (resDb.length < 1) {
        return res.status(200).json({
          message: `No hay registros en fecha: ${date} para el userId: ${id}`,
        });
      }

      for (let i = 0; i < resDb.length; i++) {
        let joinActivity = [];
        let timeActivity = "";
        let typeActivity = "";
        let joinCoffee = [];
        let coffeeCups = "";
        let coffeeSizes = "";
        let joinDrinks = [];
        let quantityDrinks = "";
        let typeDrinks = "";

        if (resDb[i].timeActivity.length >= 1) {
          timeActivity = resDb[i].timeActivity.flat();
          typeActivity = resDb[i].activities.map(e => e.activity).flat();

          /* for (let i = 0; i < timeActivity.length; i++) {
          joinActivity.push(`${timeActivity[i]} min de ${typeActivity[i]}`);
        } */
        }

        if (resDb[i].coffeeCups.length >= 1) {
          coffeeCups = resDb[i].coffeeCups.flat();
          coffeeSizes = resDb[i].coffeeSizes.map(e => e.size).flat();

          /* for (let i = 0; i < coffeeCups.length; i++) {
          coffeeCups[i] > 1
            ? joinCoffee.push(`${coffeeCups[i]} tazas de ${coffeeSizes[i]}`)
            : joinCoffee.push(`${coffeeCups[i]} taza de ${coffeeSizes[i]}`);
        } */
        }

        if (resDb[i].drinks.length >= 1) {
          quantityDrinks = resDb[i].drinks.flat();
          typeDrinks = resDb[i].alcoholTypes.map(e => e.drink).flat();

          /*  for (let i = 0; i < quantityDrinks.length; i++) {
          quantityDrinks[i] > 1
            ? joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}s`)
            : joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}`);
        } */
        }

        let obj = {
          id: resDb[i].id,
          userId: resDb[i].userId,
          dateMeal: resDb[i].dateMeal,
          timeMeal: resDb[i].timeMeal,
          description: resDb[i].description,
          sleepTime: resDb[i].sleepTime,
          napTime: resDb[i].napTime.map(e => e),
          timeActivity: timeActivity,
          nameActivity: typeActivity,
          coffeeConsumption: coffeeCups,
          coffeSize: coffeeSizes,
          drinkConsumption: quantityDrinks,
          typeDrink: typeDrinks,
        };
        finalResultId.push(obj);
      }

      return res.status(200).json(finalResultId);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
};

const getRecords_by_id = async (req, res) => {
  const { id } = req.params;
  const finalResultId = [];
  try {
    const resDb = await NewRecord.findAll({
      include: [{ all: true }],
      where: { userId: id },
    });

    if (resDb.length < 1) {
      return res
        .status(200)
        .json({ message: `No existen actividades para el userId: ${id}` });
    }

    for (let i = 0; i < resDb.length; i++) {
      let joinActivity = [];
      let timeActivity = "";
      let typeActivity = "";
      let joinCoffee = [];
      let coffeeCups = "";
      let coffeeSizes = "";
      let joinDrinks = [];
      let quantityDrinks = "";
      let typeDrinks = "";

      if (resDb[i].timeActivity.length >= 1) {
        timeActivity = resDb[i].timeActivity.flat();
        typeActivity = resDb[i].activities.map(e => e.activity).flat();

        for (let i = 0; i < timeActivity.length; i++) {
          joinActivity.push(`${timeActivity[i]} min de ${typeActivity[i]}`);
        }
      }

      if (resDb[i].coffeeCups.length >= 1) {
        coffeeCups = resDb[i].coffeeCups.flat();
        coffeeSizes = resDb[i].coffeeSizes.map(e => e.size).flat();

        for (let i = 0; i < coffeeCups.length; i++) {
          coffeeCups[i] > 1
            ? joinCoffee.push(`${coffeeCups[i]} tazas de ${coffeeSizes[i]}`)
            : joinCoffee.push(`${coffeeCups[i]} taza de ${coffeeSizes[i]}`);
        }
      }

      if (resDb[i].drinks.length >= 1) {
        quantityDrinks = resDb[i].drinks.flat();
        typeDrinks = resDb[i].alcoholTypes.map(e => e.drink).flat();

        for (let i = 0; i < quantityDrinks.length; i++) {
          quantityDrinks[i] > 1
            ? joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}s`)
            : joinDrinks.push(`${quantityDrinks[i]} ${typeDrinks[i]}`);
        }
      }

      let obj = {
        id: resDb[i].id,
        userId: resDb[i].userId,
        dateMeal: resDb[i].dateMeal,
        timeMeal: tConvert(resDb[i].timeMeal),
        description:
          resDb[i].description === "" ? "sin registro" : resDb[i].description,
        sleepTime: `${time_convert(resDb[i].sleepTime)}`,
        napTime:
          resDb[i].napTime.length < 1
            ? "sin registro"
            : resDb[i].napTime.map(e => `${e} min. de siesta`),
        activities: joinActivity.length < 1 ? "sin registro" : joinActivity,
        coffees: joinCoffee.length < 1 ? "sin registro" : joinCoffee,
        drinks: joinDrinks.length < 1 ? "sin registro" : joinDrinks,
      };
      finalResultId.push(obj);
    }

    return res.status(200).json(finalResultId);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getRecords_by_id_unformat = async (req, res) => {
  const { id } = req.params;
  const finalResultId = [];
  try {
    const resDb = await NewRecord.findAll({
      include: [{ all: true }],
      where: { userId: id },
    });

    if (resDb.length < 1) {
      return res
        .status(200)
        .json({ message: `No existen actividades para el userId: ${id}` });
    }

    for (let i = 0; i < resDb.length; i++) {
      let joinActivity = [];
      let timeActivity = "";
      let typeActivity = "";
      let joinCoffee = [];
      let coffeeCups = "";
      let coffeeSizes = "";
      let joinDrinks = [];
      let quantityDrinks = "";
      let typeDrinks = "";

      if (resDb[i].timeActivity.length >= 1) {
        timeActivity = resDb[i].timeActivity.flat();
        typeActivity = resDb[i].activities.map(e => e.activity).flat();
      }

      if (resDb[i].coffeeCups.length >= 1) {
        coffeeCups = resDb[i].coffeeCups.flat();
        coffeeSizes = resDb[i].coffeeSizes.map(e => e.size).flat();
      }

      if (resDb[i].drinks.length >= 1) {
        quantityDrinks = resDb[i].drinks.flat();
        typeDrinks = resDb[i].alcoholTypes.map(e => e.drink).flat();
      }

      let obj = {
        id: resDb[i].id,
        userId: resDb[i].userId,
        dateMeal: resDb[i].dateMeal,
        timeMeal: resDb[i].timeMeal,
        description: resDb[i].description,
        sleepTime: resDb[i].sleepTime,
        napTime: resDb[i].napTime.map(e => e),
        timeActivity: timeActivity,
        nameActivity: typeActivity,
        coffeeConsumption: coffeeCups,
        coffeSize: coffeeSizes,
        drinkConsumption: quantityDrinks,
        typeDrink: typeDrinks,
      };
      finalResultId.push(obj);
    }

    return res.status(200).json(finalResultId);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const getRecords_by_id_and_date_unformat = async (req, res) => {
  const { date } = req.body;
  const finalResult = [];
  try {
    const resDb = await NewRecord.findAll({
      include: [{ all: true }],
      where: {
        [Op.and]: [
          {
            //userId: id,
            dateMeal: date,
          },
        ],
      },
    });

    if (resDb.length < 1) {
      return res.status(200).json({
        message: `No hay registros en fecha: ${date} para el userId: ${id}`,
      });
    }

    for (let i = 0; i < resDb.length; i++) {
      let timeActivity = 0;
      let typeActivity = "";
      let coffeeCups = 0;
      let coffeeSizes = "";
      let quantityDrinks = 0;
      let typeDrinks = "";

      if (resDb[i].timeActivity.length >= 1) {
        timeActivity = resDb[i].timeActivity.flat();
        typeActivity = resDb[i].activities.map(e => e.activity).flat();
      }

      if (resDb[i].coffeeCups.length >= 1) {
        coffeeCups = resDb[i].coffeeCups.flat();
        coffeeSizes = resDb[i].coffeeSizes.map(e => e.size).flat();
      }

      if (resDb[i].drinks.length >= 1) {
        quantityDrinks = resDb[i].drinks.flat();
        typeDrinks = resDb[i].alcoholTypes.map(e => e.drink).flat();
      }

      let obj = {
        id: resDb[i].id,
        userId: resDb[i].userId,
        dateMeal: resDb[i].dateMeal,
        timeMeal: resDb[i].timeMeal,
        description: resDb[i].description,
        sleepTime: resDb[i].sleepTime,
        napTime: resDb[i].napTime.map(e => e),
        timeActivity: timeActivity,
        nameActivity: typeActivity,
        coffeeConsumption: coffeeCups,
        coffeSize: coffeeSizes,
        drinkConsumption: quantityDrinks,
        typeDrink: typeDrinks,
      };
      finalResult.push(obj);
    }

    return res.status(200).json(finalResult);
  } catch (err) {
    //return res.status(400).json(err);
    console.log(err);
  }
};

/* ================== Create New Record =================== */

const post_new_record = async (req, res) => {
  const {
    dateMeal,
    timeMeal,
    description,
    sleepTime,
    napTime,
    timeActivity,
    coffeeCups,
    drinks,
    coffee,
    drink,
    activity,
    userId,
  } = req.body;

  try {
    const newRecord = await NewRecord.create({
      dateMeal,
      timeMeal,
      description,
      sleepTime,
      napTime,
      timeActivity,
      coffeeCups,
      drinks,
      userId,
    });

    await newRecord.addCoffeeSize(coffee);
    await newRecord.addAlcoholType(drink);
    await newRecord.addActivity(activity);

    res.status(200).json({ message: `Registro creado exitosamente` });
  } catch (err) {
    return res.status(400).json(err);
  }
};

/* -------------------------Get Records By Range--------------- */

module.exports = {
  getRecords,
  getRecords_by_id,
  getRecords_by_id_unformat,
  getRecords_by_id_and_date_unformat,
  post_new_record,
};
