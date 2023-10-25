const router = require("express").Router();
const auth = require("../middleware/auth");
const {
	createUser,
	getUsers,
	getUserById,
	login,
} = require("./user.contorller");

router.post("/", createUser); //               /api/users/
router.get("/all", auth, getUsers); //
router.get("/", getUserById); //        .get   /api/users/
router.post("/login", login); //     url       /api/users/login

module.exports = router;
