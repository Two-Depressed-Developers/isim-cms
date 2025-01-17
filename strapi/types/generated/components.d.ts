import type { Schema, Struct } from '@strapi/strapi';

export interface HelpersLink extends Struct.ComponentSchema {
  collectionName: 'components_helpers_links';
  info: {
    description: '';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MembersCompResearch extends Struct.ComponentSchema {
  collectionName: 'components_members_comp_research';
  info: {
    displayName: 'Research';
  };
  attributes: {
    ORCIDLink: Schema.Attribute.Component<'helpers.link', false>;
    PublicationsLink: Schema.Attribute.Component<'helpers.link', false>;
    ReasercherIdLink: Schema.Attribute.Component<'helpers.link', false>;
    ResearchgateLink: Schema.Attribute.Component<'helpers.link', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'helpers.link': HelpersLink;
      'members-comp.research': MembersCompResearch;
    }
  }
}
