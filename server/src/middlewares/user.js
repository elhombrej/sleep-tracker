const { Router } = require("express");
const router = Router();
const {
  postUser,
  repeatedEmail,
  getUserByEmail,
  getUserById,
  updatePassword,
} = require("../controllers/user");
const bcrypt = require("bcrypt");
const { STRIPE_SECRET_KEY } = process.env;
const Stripe = require("stripe");
const JWT_SECRET = "CVDF61651BV231TR894VBCX51LIK5LÑK84";
const basicURL = "http://localhost:3000";
const jwt = require("jsonwebtoken");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

router.post("/", async (req, res) => {
  try {
    const { email, password, names, lastNames, nationality, birthday } =
      req.body.user;
    const hashedPassword = await bcrypt.hash(password, 10); //la segunda variable es el numero de rondas que se encriptara
    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    const bodyInfo = {
      email,
      hashedPassword,
      names,
      lastNames,
      nationality,
      birthday,
      stripeCustomerId: customer.id,
    };
    if (!email || !names || !lastNames) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await repeatedEmail(email);
    if (oldUser.length > 0) {
      return res.status(406).send(`El email ya esta registrado en la BD`);
    }
    let createdUser = await postUser(bodyInfo);
    res.status(201).json(createdUser); //201 es que fue creado
  } catch (error) {
    console.log("El error middleware user post / es:", error.message);
    res.status(401).send("El error middleware user post / es:", error.message);
  }
});

router.post("/google", async (req, res) => {
  try {
    const { email, names, lastNames } = req.body;
    if (!email || !names || !lastNames) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const bodyInfo = { email, names, lastNames };
    const oldUser = await repeatedEmail(email);
    if (oldUser.length > 0) {
      return res.status(202).send(oldUser);
    }
    let createdUser = await postUser(bodyInfo);
    res.status(201).json(createdUser); //201 es que fue creado
  } catch (error) {
    console.log("El error middleware user post /google es:", error.message);
    res.status(401).send("El error middleware user post /google es");
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await getUserByEmail(email);
    if (oldUser.id === 0) {
      return res.status(202).send({ status: "el usuario no existe" });
    }
    const secret = JWT_SECRET + oldUser.hashedPassword;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "50m",
    });
    const link = `${basicURL}/reiniciar_contrasena/${oldUser.id}/${token}`;
    console.log("el link es:", link);
    res.status(200).json(link); //201 es que fue creado
  } catch (error) {
    console.log(
      "El error middleware user post /forgot-password es:",
      error.message
    );
    res.status(401).send("El error middleware user post /forgot-password es");
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    if (!id || !token || !password) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await getUserById(id);
    if (!oldUser) {
      return res.status(202).send("el usuario no existe");
    }
    const secret = JWT_SECRET + oldUser.hashedPassword;
    const verify = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password, 10);
    updatePassword(id, hashedPassword);
    res.status(200).send("Verificado");
  } catch (error) {
    res.status(400).send("Sin verificar");
  }
});

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(204).send("El id no existe en la base de datos");
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.log("El error middleware user get /:email es:", error.message);
    res
      .status(401)
      .send("El error middleware user get /:email es:", error.message);
  }
});
module.exports = router;
