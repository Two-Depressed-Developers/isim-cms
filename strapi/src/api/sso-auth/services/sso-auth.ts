"use strict";

const cryptoLib = require("crypto");

module.exports = ({ strapi }) => ({
    async handleSsoLogin({ email, name, surname }) {
        const normalizedEmail = email.toLowerCase();

        const staffMemberRole = await strapi.db
            .query("plugin::users-permissions.role")
            .findOne({
                where: { name: "StaffMember" },
            });

        if (!staffMemberRole) {
            throw new Error(
                'Role "StaffMember" not found. Please create it in the admin panel.'
            );
        }

        let user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
                where: { email: normalizedEmail },
                populate: ["role", "member_profile"],
            });

        if (!user) {
            strapi.log.info(
                `User with email ${normalizedEmail} not found. Creating a new user.`
            );

            const password = cryptoLib.randomBytes(16).toString("hex");
            const username =
                `${name || ""}-${surname || ""}-${cryptoLib.randomBytes(2).toString("hex")}`.toLowerCase() ||
                normalizedEmail;

            const newUserPayload = {
                email: normalizedEmail,
                username,
                password,
                confirmed: true,
                provider: "local",
                role: staffMemberRole.id,
            };

            user =
                await strapi.plugins["users-permissions"].services.user.add(
                    newUserPayload
                );

            user = await strapi.db
                .query("plugin::users-permissions.user")
                .findOne({
                    where: { id: user.id },
                    populate: ["role", "member_profile"],
                });
        } else {
            strapi.log.info(
                `User with email ${normalizedEmail} found. Logging in.`
            );
        }

        const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
            id: user.id,
        });

        return {
            jwt,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role.name,
                memberProfileSlug: user.member_profile?.slug || null,
            },
        };
    },
});
