import classnames from "classnames";
import { __ } from "@wordpress/i18n";
import { addFilter } from "@wordpress/hooks";
import { InspectorControls, InspectorAdvancedControls, RichText, getColorClassName, useBlockProps,} from "@wordpress/block-editor";
import { createHigherOrderComponent } from "@wordpress/compose";
import { ToggleControl, PanelRow } from "@wordpress/components";


// Modification des attributs du bloc "Tableau"
function editSettings( settings, name ) {

  if( name == "core/table" && typeof settings.supports !== "undefined" ) {

    return lodash.assign( {}, settings, {
      supports: lodash.assign( {}, settings.supports, {
        anchor: true,
        align: false
      } ),
      parent: ["gco/place"],
      attributes : lodash.assign( {}, settings.attributes, {
        autoMerge: {
          type: "boolean",
          default: false
        },
      } ),
    } );
  }

  return settings;
}

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/table",
  editSettings
);

// Ajout du champ texte de gestion de l"ancre de navigation et masquage de l"éditeur de couleurs
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
  return ( props ) => {

    const {
      name,
    } = props;

    return (
      <>
        
        {name.includes("core/table") ? (
          <>
            <InspectorControls>
              <div className="core-table-inspector" aria-hidden="true"></div> 
            </InspectorControls>
            <BlockEdit {...props} />
            <InspectorAdvancedControls>
              <PanelRow>
                <ToggleControl
                  label={ __( "Fusionner les cellules vides ?", "gracietco-gut" ) }
                  help={
                    props.attributes.autoMerge
                      ? "Les cellules vides sont automatiquement fusionnées"
                      : "Les cellules vides sont laissées telles quelles"
                  }
                  checked={ props.attributes.autoMerge }
                  onChange={ () => { props.setAttributes( { autoMerge: ! props.attributes.autoMerge } ); } }
                />
              </PanelRow>
            </InspectorAdvancedControls>
          </>
        ) : (
          <BlockEdit {...props} />
        )
        }

      </>
    );
  };
}, "withAdvancedControls");

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/anchor-advanced-control",
  withAdvancedControls
);

addFilter(
  "blocks.getSaveElement",
  "gracietco-gut/core-table",
  function(element, blockType, attributes){
    if ( blockType.name !== "core/table" ) {
      return element;
    }
    else{
      const {
        hasFixedLayout,
        head,
        body,
        foot,
        backgroundColor,
        caption,
      } = attributes;
      const isEmpty = ! head.length && ! body.length && ! foot.length;

      if ( isEmpty ) {
        return null;
      }
        
      const backgroundClass = getColorClassName(
        "background-color",
        backgroundColor
      );
        
      const classes = classnames( backgroundClass, {
        "has-fixed-layout": hasFixedLayout,
        "has-background": !! backgroundClass,
      } );
        
      const hasCaption = ! RichText.isEmpty( caption );
        
      const Section = ( { type, rows } ) => {
        if ( ! rows.length ) {
          return null;
        }
        const Tag = `t${ type }`;
        return (
          <Tag>
            { rows.map( ( { cells }, rowIndex, row ) => (
              <tr key={ rowIndex }>
                { cells.map(
                  ( { content, tag, scope, align }, cellIndex, cell ) => {
                    const cellClasses = classnames( {
                      [ `has-text-align-${ align }` ]: align,
                    } );
                    const spans = {};
                    if (content === "") {
                      spans["data-delete"] = 1;
                    } else {
                      for (let i=rowIndex+1; i<row.length; i++) {
                        if (row[i].cells[cellIndex].content === "") {
                          spans["data-rowspan"] = (spans["data-rowspan"] || 1) + 1;
                        } else {
                          break;
                        }
                      }
                      for (let i=cellIndex+1; i<cell.length; i++) {
                        if (cell[i].content === "") {
                          spans["data-colspan"] = (spans["data-colspan"] || 1) + 1;
                        } else {
                          break;
                        }
                      }
                    }
                    return (
                      <RichText.Content
                        { ...spans }
                        className={
                          cellClasses
                            ? cellClasses
                            : undefined
                        }
                        data-align={ align }
                        tagName={ tag }
                        value={ content }
                        key={ cellIndex }
                        scope={
                          tag === "th" ? scope : undefined
                        }
                      />
                    );
                  }
                ) }
              </tr>
            ) ) }
          </Tag>
        );
      };
      return (
        <figure { ...useBlockProps.save() }>
          <table className={ classes === "" ? undefined : classes }>
            <Section type="head" rows={ head } />
            <Section type="body" rows={ body } />
            <Section type="foot" rows={ foot } />
          </table>
          { hasCaption && (
            <RichText.Content tagName="figcaption" value={ caption } />
          ) }
        </figure>
      );
    }
  }
);
