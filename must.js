const jwt = require("jsonwebtoken");
const SECRET_KEY = "BelajarNodeJSItuMenyengankan"

module.exports = {
	mustBeAdmin(req, res, next) {
		const role = req.user?.role;

		if (!role || role === "kasir" || role === "manager") {
			res.status(403).json({ message: "Admin role required" });
			return;
		}

		next();
	},
	mustBeKasir(req, res, next) {
		const role = req.user?.role;

		if (!role || role === "admin" || role === "manager") {
			res.status(403).json({ message: "Kasir role required" });
			return;
		}

		next();
	},
    mustBeKasirOrAdmin(req, res, next) {
		const role = req.user?.role;

		if (!role || role === "manager") {
			res.status(403).json({ message: "Kasir or Admin role required" });
			return;
		}

		next();
	},

	mustBeKasirOrManager(req, res, next) {
		const role = req.user?.role;

		if (!role || role === "admin") {
			res.status(403).json({ message: "Kasir or Manager role required" });
			return;
		}

		next();
	},

	mustLogin(req, res, next) {
		const token = req.get("Authorization")?.split(' ')[1];

		if (!token) {
			res.status(403).json({ message: "Login required" });
			return;
		}

		jwt.verify(token, SECRET_KEY, (err, payload) => {
			if (err) {
				res.status(403).json({ message: err.message });
				console.error(err);
				return;
			}

			req.user = payload;
			next();
		});
	}
};