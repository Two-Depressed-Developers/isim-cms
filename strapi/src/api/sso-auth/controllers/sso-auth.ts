"use strict";

module.exports = {
    async login(ctx) {
        try {
            const { email, name, surname } = ctx.request.body;

            if (!email) {
                return ctx.badRequest("Email is required");
            }

            const authResponse = await strapi
                .service("api::sso-auth.sso-auth")
                .handleSsoLogin({ email, name, surname });

            ctx.body = authResponse;
        } catch (error) {
            strapi.log.error("SSO Login Error:", error);
            return ctx.internalServerError(
                "An error occurred during the SSO login process."
            );
        }
    },
};
