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
            config: {
                auth: false,
                policies: ["global::has-api-key"],
            },
        },
        {
            method: "POST",
            path: "/auth-custom/verify-confirmation-token",
            handler: "auth-custom.verifyConfirmationToken",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/auth-custom/complete-registration",
            handler: "auth-custom.completeRegistration",
            config: { auth: false },
        },
        {
            method: "POST",
            path: "/auth-custom/forgot-password",
            handler: "auth-custom.forgotPassword",
            config: {
                auth: false,
                policies: ["global::has-api-key"],
            },
        },
        {
            method: "POST",
            path: "/auth-custom/reset-password",
            handler: "auth-custom.resetPassword",
            config: {
                auth: false,
                policies: ["global::has-api-key"],
            },
        },
    ],
};
