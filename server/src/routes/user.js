const { Router } = require("express");
const router = Router();

/* ==================== Import Controllers ======================== */

const {
  postUser,
  postGoogleUser,
  forgotPassword,
  resetPassword,
  getUserByEmail,
  deleteUser,
  updateProfile,
  changeUserPassword,
  getUserInfoById,
  restoreUser,
} = require("../controllers/user");
const { forgotPassswordValdiator } = require("../middlewares/user");
//> ==================== End Points ======================== <//

router.post("/", postUser);
router.post("/restoreUser/:id", restoreUser);
router.post("/google", postGoogleUser);
router.post("/forgot-password", forgotPassswordValdiator, forgotPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.get("/:email", getUserByEmail);
router.delete("/:id/:password", deleteUser);
router.put("/:id", updateProfile);
router.get("/userId/:id", getUserInfoById);
router.put("/changepassword/:id", changeUserPassword);

module.exports = router;
