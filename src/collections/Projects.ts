import { lexicalEditor, lexicalHTML, HTMLConverterFeature } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

const editor = lexicalEditor({
    features: ({ defaultFeatures }) => {
        return [
            ...defaultFeatures.filter((feature) =>
                [
                    "paragraph",
                    "heading",
                    "italic",
                    "bold",
                    "underline",
                    "subscript",
                    "superscript",
                    "orderedList",
                    "unorderedList",
                    "link",
                    "align",
                ].includes(feature.key),
            ),
            HTMLConverterFeature({}),
        ];
    },
});

export const Projects: CollectionConfig = {
    slug: "projects",
    admin: { useAsTitle: "title" },
    fields: [
        {
            name: "title",
            type: "text",
            admin: {},
            required: true,
        },
        {
            name: "subtitle",
            type: "text",
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            required: true,
        },
        {
            name: "client",
            label: "Client",
            type: "text",
            required: true,
        },
        {
            name: "date",
            label: "Date",
            type: "text",
            required: true,
        },
        {
            name: "involvement",
            label: "Involvement",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "richText",
            editor: editor,
            required: true,
        },
        lexicalHTML("description", { name: "description_html" }),
        {
            name: "backgroundColor",
            label: "Background Color",
            type: "text",
        },
        {
            name: "textColor",
            label: "Text Color",
            type: "text",
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media",
            required: true,
        },
        {
            name: "sections",
            label: "Sections",
            type: "array",
            minRows: 1,
            fields: [
                {
                    name: "text",
                    label: "Text",
                    type: "richText",
                    editor: editor,
                    required: true,
                },
                lexicalHTML("text", { name: "text_html" }),
                {
                    name: "images",
                    label: "Images",
                    type: "array",
                    minRows: 1,
                    fields: [
                        {
                            name: "image",
                            type: "upload",
                            relationTo: "media",
                            required: true,
                        },
                        {
                            name: "position",
                            type: "select",
                            options: [
                                { label: "Left", value: "left" },
                                { label: "Right", value: "right" },
                            ],
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
};
