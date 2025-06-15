/**
 * member router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::member.member", {
    config: {
        update: {
            policies: ["global::is-owner"],
        },
    },
});
