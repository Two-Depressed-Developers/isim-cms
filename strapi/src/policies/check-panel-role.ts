module.exports = async (policyContext, config, { strapi }) => {
    const apiKey = policyContext.request.header["x-api-secret-key"];
    if (apiKey && apiKey === process.env.API_SECRET_KEY) {
        strapi.log.info(
            "check-panel-role policy: Access granted via API_SECRET_KEY."
        );
        return true;
    }

    const user = policyContext.state.user;

    if (!user) {
        return false;
    }

    const userWithRoles = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
            populate: ["panelRoles"],
        }
    );

    if (!userWithRoles || !userWithRoles.panelRoles) {
        return false;
    }

    const userRoleNames = userWithRoles.panelRoles.map((r) => r.name);

    if (userRoleNames.includes("PanelAdmin")) {
        return true;
    }

    const requiredRoles = config.roles || [];

    const hasPermission = requiredRoles.some((role) =>
        userRoleNames.includes(role)
    );

    return hasPermission;
};
