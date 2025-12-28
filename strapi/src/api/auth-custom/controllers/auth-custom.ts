"use strict";

const getUserRoles = (user) => {
    const roles = [];

    if (user.role?.name) {
        roles.push(user.role.name);
    }

    if (user.panelRoles && Array.isArray(user.panelRoles)) {
        user.panelRoles.forEach((panelRole) => {
            if (panelRole?.name) {
                roles.push(panelRole.name);
            }
        });
    }

    return [...new Set(roles)];
};

module.exports = {
    async loginLocal(ctx) {
        const { identifier, password } = ctx.request.body;

        if (!identifier || !password) {
            return ctx.badRequest("Podaj email i hasło");
        }

        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: {
                    $or: [
                        { email: identifier.toLowerCase() },
                        { username: identifier },
                    ],
                },
                populate: ["role", "member_profile", "panelRoles"],
            });

        if (!user) {
            return ctx.badRequest("Nieprawidłowe dane logowania");
        }

        if (user.blocked) {
            return ctx.badRequest("Konto jest zablokowane");
        }

        const validPassword = await strapi
            .plugin("users-permissions")
            .service("user")
            .validatePassword(password, user.password);

        if (!validPassword) {
            return ctx.badRequest("Nieprawidłowe dane logowania");
        }

        const jwt = strapi
            .plugin("users-permissions")
            .service("jwt")
            .issue({ id: user.id });

        const userRoles = getUserRoles(user);

        return {
            jwt,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                confirmed: user.confirmed,
                roles: userRoles,
                memberProfileSlug: user.member_profile?.slug ?? null,
                hasSsoLinked: !!user.sso_uid,
            },
        };
    },

    async loginSSO(ctx) {
        const { providerId, email } = ctx.request.body;

        let user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: { sso_uid: providerId.toString() },
                populate: ["role", "member_profile", "panelRoles"],
            });

        if (!user) {
            const userByEmail = await strapi.db
                .query("plugin::users-permissions.user")
                .findOne({
                    where: { email: email.toLowerCase() },
                });

            if (!userByEmail) {
                return ctx.badRequest("UserNotFound");
            }

            await strapi.entityService.update(
                "plugin::users-permissions.user",
                userByEmail.id,
                {
                    data: { sso_uid: providerId.toString() },
                }
            );

            user = await strapi.db
                .query("plugin::users-permissions.user")
                .findOne({
                    where: { id: userByEmail.id },
                    populate: ["role", "member_profile"],
                });
        }

        if (user.blocked) return ctx.badRequest("Konto zablokowane");

        const jwt = strapi
            .plugin("users-permissions")
            .service("jwt")
            .issue({ id: user.id });

        const userRoles = getUserRoles(user);

        return {
            jwt,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                confirmed: user.confirmed,
                roles: userRoles,
                memberProfileSlug: user.member_profile?.slug ?? null,
                hasSsoLinked: true,
            },
        };
    },

    async unlinkAccount(ctx) {
        const user = ctx.state.user;

        await strapi.entityService.update(
            "plugin::users-permissions.user",
            user.id,
            {
                data: {
                    sso_uid: null,
                },
            }
        );

        const updatedUser = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({ where: { id: user.id } });

        return { success: true, user: updatedUser };
    },
};
