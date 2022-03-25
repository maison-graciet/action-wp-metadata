import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";

registerBlockType( "gco/content", {
  apiVersion: 2,
  title: "Contenu",
  description: "Insérez le contenu du modèle de page à l'aide de ce bloc.",
  category: "templating",
  keywords: ["template"],
  supports: {
    html: false,
    reusable: true,
    color: false
  },
  edit: Edit,
  save
} );
