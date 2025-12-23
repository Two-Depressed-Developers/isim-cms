module.exports = {
    routes: [
        {
            method: "POST",
            path: "/admin-panel/bulk-create-users",
            handler: "admin-panel.bulkCreateUsers",
            config: {
                auth: {
                    required: true,
                },
            },
        },
    ],
};
