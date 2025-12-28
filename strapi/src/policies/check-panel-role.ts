module.exports = async (policyContext, config, { strapi }) => {
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
