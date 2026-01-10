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

const prepareUserDataToReturn = (user, roles = null) => {
    const userRoles = roles || getUserRoles(user);

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        confirmed: user.confirmed,
        roles: userRoles,
        memberProfileSlug: user.member_profile?.slug ?? null,
        hasSsoLinked: !!user.sso_uid,
    };
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
            user: prepareUserDataToReturn(user, userRoles),
        };
    },

    async loginSSO(ctx) {
        const { email, groups = [] } = ctx.request.body;
        if (!email) return ctx.badRequest("Email jest wymagany");

        const user = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
                filters: { email: email.toLowerCase() },
                populate: ["role", "member_profile", "panelRoles"],
            });

        if (!user) return ctx.badRequest("UserNotFound");
        if (user.blocked) return ctx.badRequest("Konto jest zablokowane");

        const filteredGroups = groups.filter((g) => g !== "authentik Admins");
        const roles = filteredGroups.length
            ? await strapi
                  .documents("plugin::users-permissions.role")
                  .findMany({
                      filters: { name: { $in: filteredGroups } },
                      fields: ["id"],
                  })
            : [];

        const updatedUser = await strapi
            .documents("plugin::users-permissions.user")
            .update({
                documentId: user.documentId,
                data: { panelRoles: { set: roles.map((r) => r.id) } },
                populate: ["role", "panelRoles", "member_profile"],
            });

        const jwt = strapi
            .plugin("users-permissions")
            .service("jwt")
            .issue({ id: user.id });

        return {
            jwt,
            user: prepareUserDataToReturn(updatedUser),
        };
    },

    async verifyConfirmationToken(ctx) {
        const { token } = ctx.request.body;

        if (!token) {
            return ctx.badRequest("Token jest wymagany");
        }

        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: { confirmationToken: token },
                populate: ["role", "panelRoles"],
            });

        if (!user) {
            return ctx.badRequest("Nieprawidłowy lub wygasły token");
        }

        if (user.blocked) {
            return ctx.badRequest("Konto jest zablokowane");
        }

        const tokenExpirationTime = 48 * 60 * 60 * 1000; // 48h
        const userCreatedAt = new Date(user.createdAt).getTime();
        const now = Date.now();

        if (now - userCreatedAt > tokenExpirationTime) {
            return ctx.badRequest("Nieprawidłowy lub wygasły token");
        }

        return {
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    },

    async completeRegistration(ctx) {
        const { token, password, username } = ctx.request.body;

        if (!token || !password) {
            return ctx.badRequest("Token i hasło są wymagane");
        }

        if (password.length < 6) {
            return ctx.badRequest("Hasło musi mieć minimum 6 znaków");
        }

        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: { confirmationToken: token },
                populate: ["role", "panelRoles", "member_profile"],
            });

        if (!user) {
            return ctx.badRequest("Nieprawidłowy lub wygasły token");
        }

        if (user.blocked) {
            return ctx.badRequest("Konto jest zablokowane");
        }

        const updateData: Record<string, any> = {
            password,
            confirmed: true,
            confirmationToken: null,
        };

        if (username && username.trim()) {
            updateData.username = username.trim();
        }

        await strapi.entityService.update(
            "plugin::users-permissions.user",
            user.id,
            { data: updateData }
        );

        return {
            success: true,
        };
    },

    async forgotPassword(ctx) {
        const { email } = ctx.request.body;

        if (!email) {
            return ctx.badRequest("Email jest wymagany");
        }

        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({ where: { email: email.toLowerCase() } });

        if (!user) {
            return {
                success: false,
            };
        }

        const token = require("crypto").randomBytes(32).toString("hex");

        const resetPasswordExpires = new Date();
        resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

        await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                reset_password_expires: resetPasswordExpires,
            },
        });

        return { success: true, token };
    },

    async resetPassword(ctx) {
        const { token, password, passwordConfirmation } = ctx.request.body;

        console.log("Password reset request received:", {
            token,
            password,
            passwordConfirmation,
        });

        if (!token || !password) {
            return ctx.badRequest("Token i nowe hasło są wymagane");
        }

        if (password.length < 6) {
            return ctx.badRequest("Hasło jest za krótkie");
        }

        if (password !== passwordConfirmation) {
            return ctx.badRequest("Hasła nie są identyczne");
        }

        const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: {
                    resetPasswordToken: token,
                    reset_password_expires: { $gt: new Date() },
                },
            });

        if (!user) {
            return ctx.badRequest("Token jest nieprawidłowy lub wygasł");
        }

        await strapi.plugin("users-permissions").service("user").edit(user.id, {
            password: password,
            resetPasswordToken: null,
            reset_password_expires: null,
        });

        return { success: true, message: "Hasło zostało zmienione" };
    },
};
