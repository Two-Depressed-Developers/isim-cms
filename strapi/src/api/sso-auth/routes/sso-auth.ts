module.exports = {
    routes: [
        {
            method: "POST",
            path: "/sso-auth/login",
            handler: "sso-auth.login",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
