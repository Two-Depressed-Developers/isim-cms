"use strict";

export default {
    async getSchema(ctx) {
        try {
            const { uid } = ctx.params;

            const contentType = strapi.contentType(uid);

            if (!contentType) {
                return ctx.notFound("Content type not found");
            }

            const schema = contentType.__schema__.attributes;

            if (!schema) {
                return ctx.notFound("Schema not found");
            }

            ctx.body = schema;
        } catch (err) {
            ctx.body = err;
        }
    }
};
