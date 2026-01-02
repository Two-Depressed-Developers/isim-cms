export default {
    routes: [
        {
            method: "GET",
            path: "/schemas/:uid",
            handler: "schema-provider.getSchema",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: "GET",
            path: "/schemas/deep/:uid",
            handler: "schema-provider.getDeepSchema",
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
