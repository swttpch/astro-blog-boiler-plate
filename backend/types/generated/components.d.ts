import type { Schema, Attribute } from '@strapi/strapi';

export interface ListInput extends Schema.Component {
  collectionName: 'components_list_inputs';
  info: {
    displayName: 'Input';
    description: '';
  };
  attributes: {
    label: Attribute.String & Attribute.Required;
    type: Attribute.Enumeration<
      ['Text', 'TextArea', 'Email', 'Phone', 'Number', 'Password']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'Text'>;
    size: Attribute.Enumeration<
      ['Size 100%', 'Size 66%', 'Size 50%', 'Size 33%']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'Size 100%'>;
    required: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    regex: Attribute.String;
  };
}

export interface ListList extends Schema.Component {
  collectionName: 'components_list_lists';
  info: {
    displayName: 'List';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface ListRelated extends Schema.Component {
  collectionName: 'components_list_relateds';
  info: {
    displayName: 'related';
  };
  attributes: {
    articles: Attribute.Relation<
      'list.related',
      'oneToMany',
      'api::article.article'
    >;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    canonicalURL: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'list.input': ListInput;
      'list.list': ListList;
      'list.related': ListRelated;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
