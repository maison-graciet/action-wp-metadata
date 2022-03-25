import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import blockIcons from "../icons.js";

registerBlockType( "gco/debug", {
  apiVersion: 2,
  title: "Debug",
  description: "Affiches les données des différents composants utilisés",
  category: "devel",
  icon: blockIcons.debug,
  keywords: ["debug"],
  supports: {
    html: false,
    reusable: true,
    color: false
  },
  edit: Edit,
  save
} );
