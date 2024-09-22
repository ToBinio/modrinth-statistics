db.createUser(
    {
        user: "server",
        pwd:  "noPass4tooDay!",
        roles: [ { role: "readWrite", db: "stats" }]
    }
)