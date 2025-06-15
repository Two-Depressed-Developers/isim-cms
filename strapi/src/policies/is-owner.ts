"use strict";

/**
 * `is-owner` policy.
 */

module.exports = async (policyContext, config, { strapi }) => {
    const { user } = policyContext.state;

    const { id: memberProfileId } = policyContext.params;

    if (!user) {
        strapi.log.warn("is-owner policy: No authenticated user found.");
        return false;
    }

    const authenticatedUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        { populate: ["member_profile"] }
    );

    if (!authenticatedUser.member_profile) {
        strapi.log.warn(
            `is-owner policy: User ${user.email} has no member_profile linked.`
        );
        return false;
    }

    if (
        String(authenticatedUser.member_profile.documentId) ===
        String(memberProfileId)
    ) {
        strapi.log.info(
            `is-owner policy: Access granted for user ${user.email} to profile ${memberProfileId}.`
        );
        return true;
    }

    strapi.log.warn(
        `is-owner policy: Access DENIED for user ${user.email}. Tried to access profile ${memberProfileId} but owns ${authenticatedUser.member_profile.documentId}.`
    );
    return false;
};
