"use strict";

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = {
    async bulkCreateUsers(ctx) {
        const user = ctx.state.user;

        if (!user) {
            return ctx.unauthorized("Brak autoryzacji");
        }

        const userWithRole = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: { id: user.id },
                populate: ["role"],
            });

        if (userWithRole.role.name !== "PanelAdmin") {
            return ctx.forbidden("Brak uprawnień");
        }

        const { emails } = ctx.request.body;

        if (!Array.isArray(emails) || emails.length === 0) {
            return ctx.badRequest("Brak listy emaili");
        }

        const createdUsers = [];
        const failedEmails = [];

        for (const rawEmail of emails) {
            const email = rawEmail?.toLowerCase().trim();

            if (!email || !isValidEmail(email)) {
                failedEmails.push({
                    email: rawEmail,
                    reason: "Nieprawidłowy format email",
                });
                continue;
            }

            try {
                const existingUser = await strapi.db
                    .query("plugin::users-permissions.user")
                    .findOne({ where: { email: email.toLowerCase() } });

                if (existingUser) {
                    failedEmails.push({
                        email,
                        reason: "Użytkownik już istnieje",
                    });
                    continue;
                }

                const password = Math.random().toString(36).slice(-8);

                await strapi
                    .plugin("users-permissions")
                    .service("user")
                    .add({
                        email: email.toLowerCase(),
                        username: email.split("@")[0],
                        password,
                        confirmed: false,
                    });

                createdUsers.push({ email });
            } catch (error) {
                failedEmails.push({ email, reason: error.message });
            }
        }

        return {
            createdUsers,
            failedEmails,
        };
    },
};
