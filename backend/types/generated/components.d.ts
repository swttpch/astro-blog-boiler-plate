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
    placeholder: Attribute.String & Attribute.Required;
    errorMessage: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
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

export interface ListOption extends Schema.Component {
  collectionName: 'components_list_options';
  info: {
    displayName: 'Option';
    description: '';
  };
  attributes: {
    value: Attribute.String & Attribute.Required;
    label: Attribute.String & Attribute.Required;
    disabled: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

export interface ListParagraph extends Schema.Component {
  collectionName: 'components_list_paragraphs';
  info: {
    displayName: 'paragraph';
    description: '';
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'Markdown';
          preset: 'light';
        }
      >;
  };
}

export interface ListSelect extends Schema.Component {
  collectionName: 'components_list_selects';
  info: {
    displayName: 'Select';
    description: '';
  };
  attributes: {
    options: Attribute.Component<'list.option', true>;
    label: Attribute.String & Attribute.Required;
    defaultValue: Attribute.String;
    errorMessage: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    placeholder: Attribute.String & Attribute.Required;
    size: Attribute.Enumeration<
      ['Size 100%', 'Size 66%', 'Size 50%', 'Size 33%']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'Size 100%'>;
  };
}

export interface SharedInfoGroupSection extends Schema.Component {
  collectionName: 'components_shared_info_group_sections';
  info: {
    displayName: 'Info Group Section';
    icon: 'layout';
    description: '';
  };
  attributes: {};
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    description: '';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<
      ['Facebook', 'Twitter', 'Github', 'LinkedIn', 'Dribbble']
    > &
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
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    url: Attribute.String;
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
      'list.option': ListOption;
      'list.paragraph': ListParagraph;
      'list.select': ListSelect;
      'shared.info-group-section': SharedInfoGroupSection;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
