db.createUser({
	user: process.env.MONGODB_USER,
	pwd: process.env.MONGODB_PASSWORD,
	roles: [{ role: "readWrite", db: "stats" }],
});
