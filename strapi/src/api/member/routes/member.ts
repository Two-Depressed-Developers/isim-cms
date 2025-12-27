/**
 * member router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::member.member", {
    config: {
        update: {
            policies: [
                {
                    name: "global::check-panel-role",
                    config: { roles: ["StaffMember"] },
                },
                {
                    name: "global::is-owner",
                    config: {},
                },
            ],
        },
    },
});
