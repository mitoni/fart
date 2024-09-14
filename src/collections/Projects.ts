import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

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
            name: "description",
            type: "text",
            required: true,
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: true,
            required: true,
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
                    editor: lexicalEditor({
                        features: ({ defaultFeatures }) => {
                            console.log(defaultFeatures);
                            return defaultFeatures.filter((feature) =>
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
                            );
                        },
                    }),
                    required: true,
                },
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
