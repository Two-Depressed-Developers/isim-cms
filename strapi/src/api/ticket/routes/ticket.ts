/**
 * ticket router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::ticket.ticket", {
    config: {
        create: {},
        findOne: {},
        find: {
            policies: [
                {
                    name: "global::check-panel-role",
                    config: { roles: ["Helpdesk"] },
                },
            ],
        },
        update: {
            policies: [
                {
                    name: "global::check-panel-role",
                    config: { roles: ["Helpdesk"] },
                },
            ],
        },
        delete: {
            policies: [
                {
                    name: "global::check-panel-role",
                    config: { roles: ["Helpdesk"] },
                },
            ],
        },
    },
});
