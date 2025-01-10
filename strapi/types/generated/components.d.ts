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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'helpers.link': HelpersLink;
    }
  }
}
