import type { Core } from "@strapi/strapi";

export default {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register(/* { strapi }: { strapi: Core.Strapi } */) {},

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        const rolesToCreate = [
            {
                name: "StaffMember",
                description:
                    "Role for members of the department. Allows you to edit your profile",
            },
            {
                name: "PanelAdmin",
                description: "Panel Admin",
            },
            {
                name: "Helpdesk",
                description: "Helpdesk role",
            },
        ];

        const existingRoles = await strapi
            .query("plugin::users-permissions.role")
            .findMany();

        for (const roleData of rolesToCreate) {
            const exists = existingRoles.find((r) => r.name === roleData.name);
            if (!exists) {
                const role = await strapi
                    .query("plugin::users-permissions.role")
                    .create({ data: roleData });

                console.log(`Created role: ${role.name}`);
            }
        }
    },
};
