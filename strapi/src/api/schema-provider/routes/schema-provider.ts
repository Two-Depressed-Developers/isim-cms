export default {
    routes: [
        {
            method: "GET",
            path: "/schemas/:uid",
            handler: "schema-provider.getSchema",
            config: {
                auth: false,
                policies: [],
                middlewares: []
            }
        }
    ]
};
