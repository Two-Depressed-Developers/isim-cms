"use strict";

import type { Context } from "koa";

interface StrapiBaseAttribute {
    type: string;
    component?: string;
    components?: string[];
    [key: string]: unknown;
}

interface DeepSchemaNode {
    type: string;
    componentSchema?: Record<string, DeepSchemaNode>;
    components?: {
        uid: string;
        schema: Record<string, DeepSchemaNode>;
    }[];
    [key: string]: unknown;
}

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
    },
    async getDeepSchema(ctx: Context) {
        try {
            const { uid } = ctx.params as { uid: string };
            const contentType = strapi.contentType(uid as any);

            if (!contentType) {
                return ctx.notFound("Content type not found");
            }

            const getFullSchema = (
                attributes: Record<string, any>
            ): Record<string, DeepSchemaNode> => {
                const fullSchema: Record<string, DeepSchemaNode> = {};

                for (const [key, attribute] of Object.entries(attributes)) {
                    const attr = attribute as StrapiBaseAttribute;

                    if (attr.type === "component" && attr.component) {
                        const componentDef =
                            strapi.components[
                                attr.component as keyof typeof strapi.components
                            ];
                        const { components: _, ...restAttr } = attr;

                        fullSchema[key] = {
                            ...restAttr,
                            componentSchema: getFullSchema(
                                componentDef.attributes
                            ),
                        };
                    } else if (attr.type === "dynamiczone" && attr.components) {
                        const { components: componentUids, ...restAttr } = attr;
                        fullSchema[key] = {
                            ...restAttr,
                            components: componentUids.map((compUid: string) => {
                                const compDef =
                                    strapi.components[
                                        compUid as keyof typeof strapi.components
                                    ];
                                return {
                                    uid: compUid,
                                    schema: getFullSchema(compDef.attributes),
                                };
                            }),
                        };
                    } else {
                        const { components: _, ...restAttr } = attr;
                        fullSchema[key] = restAttr;
                    }
                }

                return fullSchema;
            };

            const deepSchema = getFullSchema(contentType.attributes);

            ctx.body = {
                uid: contentType.uid,
                kind: contentType.kind,
                attributes: deepSchema,
            };
        } catch (err: any) {
            ctx.badRequest("Schema processing error", { details: err.message });
        }
    },
};
