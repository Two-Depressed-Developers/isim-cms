"use strict";

module.exports = (policyContext, config, { strapi }) => {
    const apiKey = policyContext.request.header["x-api-secret-key"];

    if (apiKey && apiKey === process.env.API_SECRET_KEY) {
        return true;
    }

    strapi.log.warn(
        "has-api-key policy: Unauthorized access attempt without valid API Key."
    );
    return false;
};
