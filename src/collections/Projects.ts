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
    ],
};
