import type { CollectionConfig } from "payload";

export const Locations: CollectionConfig = {
  slug: "locations",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "state", "district"],
    group: "Content",
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "nameHindi", type: "text", label: "Name (Hindi)" },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "type",
      type: "select",
      options: [
        { label: "Country", value: "country" },
        { label: "State", value: "state" },
        { label: "District", value: "district" },
        { label: "City", value: "city" },
      ],
    },
    { name: "state", type: "text", label: "State" },
    { name: "district", type: "text", label: "District" },
    {
      name: "parent",
      type: "relationship",
      relationTo: "locations",
      label: "Parent Location",
    },
  ],
};
