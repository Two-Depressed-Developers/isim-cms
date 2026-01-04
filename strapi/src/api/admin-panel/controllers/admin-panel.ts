"use strict";

const nodeCrypto = require("crypto");

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
                populate: ["panelRoles"],
            });

        if (
            !userWithRole.panelRoles.some((role) => role.name === "PanelAdmin")
        ) {
            return ctx.forbidden("Brak uprawnień");
        }

        const { emails } = ctx.request.body;

        if (!Array.isArray(emails) || emails.length === 0) {
            return ctx.badRequest("Brak listy emaili");
        }

        const staffRole = await strapi.db
            .query("plugin::users-permissions.role")
            .findOne({ where: { name: "StaffMember" } });

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

                const tempPassword = nodeCrypto.randomBytes(16).toString("hex");
                const token = nodeCrypto.randomBytes(64).toString("hex");

                await strapi
                    .plugin("users-permissions")
                    .service("user")
                    .add({
                        email,
                        username: email,
                        password: tempPassword,
                        confirmed: false,
                        panelRoles: staffRole ? [staffRole.id] : [],
                        confirmationToken: token,
                    });

                createdUsers.push({ email, token });
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
