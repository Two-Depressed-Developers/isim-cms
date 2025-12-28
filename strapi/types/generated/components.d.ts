import type { Schema, Struct } from '@strapi/strapi';

export interface HelpersImageLink extends Struct.ComponentSchema {
  collectionName: 'components_helpers_image_links';
  info: {
    displayName: 'Image Link';
    icon: 'link';
  };
  attributes: {
    alt: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files'>;
    link: Schema.Attribute.Component<'helpers.link', false>;
  };
}

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
      Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    openInNewWindow: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    subLinks: Schema.Attribute.Component<'navigation.sub-link', true>;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HelpersSimpleLink extends Struct.ComponentSchema {
  collectionName: 'components_helpers_simple_links';
  info: {
    description: '';
    displayName: 'Simple Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewWindow: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    URL: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface MembersCompConsultationAvailability
  extends Struct.ComponentSchema {
  collectionName: 'components_members_comp_consultation_availabilities';
  info: {
    description: '';
    displayName: 'ConsultationAvailability';
    icon: 'clock';
  };
  attributes: {
    dayOfWeek: Schema.Attribute.Enumeration<
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    >;
    durationMinutes: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<10>;
    endTime: Schema.Attribute.Time;
    isActive: Schema.Attribute.Boolean;
    startTime: Schema.Attribute.Time;
  };
}

export interface MembersCompResearch extends Struct.ComponentSchema {
  collectionName: 'components_members_comp_research';
  info: {
    description: '';
    displayName: 'Research';
  };
  attributes: {
    ORCIDLink: Schema.Attribute.Component<'helpers.simple-link', false>;
    PublicationsLink: Schema.Attribute.Component<'helpers.simple-link', false>;
    ReasercherIdLink: Schema.Attribute.Component<'helpers.simple-link', false>;
    ResearchgateLink: Schema.Attribute.Component<'helpers.simple-link', false>;
  };
}

export interface NavigationFooter extends Struct.ComponentSchema {
  collectionName: 'components_navigation_footers';
  info: {
    description: '';
    displayName: 'Footer';
    icon: 'arrowDown';
  };
  attributes: {
    copyrightText: Schema.Attribute.Text & Schema.Attribute.Required;
    sections: Schema.Attribute.Component<'sections.simple-section', true>;
    universityLogo: Schema.Attribute.Component<'helpers.image-link', false>;
  };
}

export interface NavigationHeader extends Struct.ComponentSchema {
  collectionName: 'components_navigation_headers';
  info: {
    displayName: 'Header';
    icon: 'arrowUp';
  };
  attributes: {
    links: Schema.Attribute.Component<'helpers.link', true>;
    logo: Schema.Attribute.Component<'helpers.image-link', false>;
  };
}

export interface NavigationSubLink extends Struct.ComponentSchema {
  collectionName: 'components_navigation_sub_links';
  info: {
    description: '';
    displayName: 'SubLink';
    icon: 'link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    openInNewWindow: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchOffersCompOfferSection extends Struct.ComponentSchema {
  collectionName: 'components_research_offers_comp_offer_sections';
  info: {
    displayName: 'Offer-section';
    icon: 'bulletList';
  };
  attributes: {
    features: Schema.Attribute.Component<
      'research-offers-comp.section-feature-item',
      true
    >;
    sectionTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ResearchOffersCompSectionFeatureItem
  extends Struct.ComponentSchema {
  collectionName: 'components_research_offers_comp_section_feature_items';
  info: {
    displayName: 'Section-feature-item';
    icon: 'plus';
  };
  attributes: {
    value: Schema.Attribute.Text;
  };
}

export interface SectionsSimpleSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_simple_sections';
  info: {
    description: '';
    displayName: 'Simple section';
    icon: 'layer';
  };
  attributes: {
    cta: Schema.Attribute.Component<'helpers.link', false>;
    images: Schema.Attribute.Component<'helpers.image-link', true>;
    text: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'helpers.image-link': HelpersImageLink;
      'helpers.link': HelpersLink;
      'helpers.simple-link': HelpersSimpleLink;
      'members-comp.consultation-availability': MembersCompConsultationAvailability;
      'members-comp.research': MembersCompResearch;
      'navigation.footer': NavigationFooter;
      'navigation.header': NavigationHeader;
      'navigation.sub-link': NavigationSubLink;
      'research-offers-comp.offer-section': ResearchOffersCompOfferSection;
      'research-offers-comp.section-feature-item': ResearchOffersCompSectionFeatureItem;
      'sections.simple-section': SectionsSimpleSection;
    }
  }
}
