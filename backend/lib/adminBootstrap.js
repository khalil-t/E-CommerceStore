import User from "../model/user.model.js";


const SINGLE_ADMIN_INDEX = {
	name: "single_admin_role",
	unique: true,
	partialFilterExpression: { role: "admin" },
};


export const isAdminBootstrapEnabled = () => process.env.ALLOW_ADMIN_BOOTSTRAP === "true";


export const ensureSingleAdminIndex = async () => {
	await User.collection.createIndex({ role: 1 }, SINGLE_ADMIN_INDEX);
};

export const hasAdmin = () => User.exists({ role: "admin" });


export const createInitialAdmin = ({ name, email, password }) =>
	User.create({ name, email, password, role: "admin" });
