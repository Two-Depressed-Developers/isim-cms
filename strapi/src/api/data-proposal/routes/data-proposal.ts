/**
 * data-proposal router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::data-proposal.data-proposal", {
    config: {
        create: {
            policies: ["global::has-api-key"],
        },
    },
});
