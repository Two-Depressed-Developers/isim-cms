module.exports = {
    routes: [
        {
            method: "POST",
            path: "/auth-custom/local",
            handler: "auth-custom.loginLocal",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/auth-custom/sso-login",
            handler: "auth-custom.loginSSO",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/auth-custom/unlink-account",
            handler: "auth-custom.unlinkAccount",
            config: {
                auth: {
                    required: true,
                },
            },
        },
    ],
};
