import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow, SelectControl, ToggleControl, TextControl} from "@wordpress/components";
import { useEffect, Fragment } from "@wordpress/element";
import MapBlock from "./map.js";
import { config as conf } from "../../../gracietco-gut.config.js";
const config = conf["b16-map"];

/* acf REST & geocoding APIs */
import ACF from "./rest-acf.js";
import geoCode from "./geocoding.js";

export default function Edit( props ) {
  const { attributes, setAttributes } = props;

  const {
    allBranches,
    branchShown,
    allInfo,
    showMail,
    showAddress,
    showPhone,
    showLink,
    linkText,
    linkAnchor,
    hasCTA,
    acf,
    asideTitle,
    tileServer,
    tileAttribution
  } = attributes;
  const blockProps = useBlockProps();

  /* initialize contact info from ACF rest & geocode addresses */
  useEffect( () => {
    (async () => {
      await ACF.ready;
      const addresses = await geoCode(ACF.fields);
      props.setAttributes({ acf: addresses });
      if (branchShown === -1) {
        const currentId = wp.data.select("core/editor").getCurrentPostId();
        if (typeof addresses.find(e => parseInt(e.id) === currentId) !== "undefined") {
          props.setAttributes({ branchShown: currentId });
        }
        else {
          props.setAttributes({ branchShown: parseInt(addresses[0].id) });
        }
      }
    })();
    props.setAttributes({ tileServer: config.tileServer });
    props.setAttributes({ tileAttribution: config.tileAttribution });
  }, []);

  return (
    <Fragment>
      <InspectorControls key="setting">
        <PanelBody
          title="Paramétrage de la carte"
          initialOpen={true}
        >
          <PanelRow>
            <ToggleControl
              label="Afficher toutes les filiales ?"
              help={
                props.attributes.allBranches
                  ? "Toutes les filiales sont affichées sur la carte"
                  : "Une seule filiale est affichée sur la carte"
              }
              checked={ props.attributes.allBranches }
              onChange={ () => props.setAttributes( { allBranches: ! props.attributes.allBranches } ) }
            />
          </PanelRow>
          { !props.attributes.allBranches ? (
            <PanelRow>
              <SelectControl
                label="Filiale à afficher"
                value={ branchShown }
                options={ acf.map(e => 
                  ({value: e.id, label: e.acf.nom})
                )
                }
                onChange={ (option) =>
                  props.setAttributes( { branchShown: parseInt(option) } )
                }
              />
            </PanelRow>
          ) : (
            <PanelRow>
              <TextControl
                label="Titre du panneau latéral"
                help="Définissez le titre affiché en regard de la carte"
                value={ asideTitle }
                onChange={ asideTitle => setAttributes( { asideTitle } )}
              />
            </PanelRow> 
          )}
          <PanelRow>
            <ToggleControl
              label="Affichage complet"
              help={
                props.attributes.allInfo
                  ? "Toutes les informations sont affichées"
                  : "Choisir les informations à afficher"
              }
              checked={ props.attributes.allInfo }
              onChange={ () => { props.setAttributes( { allInfo: ! props.attributes.allInfo } ); } }
            />
          </PanelRow>
        </PanelBody>
        { !props.attributes.allInfo && (
          <PanelBody
            title="Informations à afficher"
            initialOpen={true}
          >
            <PanelRow>
              <ToggleControl
                label="Afficher l'adresse ?"
                help={
                  props.attributes.showAddress
                    ? "L'adresse est affichée"
                    : "L'adresse est masquée"
                }
                checked={ props.attributes.showAddress }
                onChange={ () => { props.setAttributes( { showAddress: ! props.attributes.showAddress } ); } }
              />
            </PanelRow>
            <PanelRow>
              <ToggleControl
                label="Afficher l'e-mail ?"
                help={
                  props.attributes.showMail
                    ? "L'e-mail est affiché"
                    : "L'e-mail est masqué"
                }
                checked={ props.attributes.showMail }
                onChange={ () => { props.setAttributes( { showMail: ! props.attributes.showMail } ); } }
              />
            </PanelRow>
            <PanelRow>
              <ToggleControl
                label="Afficher le téléphone ?"
                help={
                  props.attributes.showPhone
                    ? "Le téléphone est affiché"
                    : "Le téléphone est masqué"
                }
                checked={ props.attributes.showPhone }
                onChange={ () => { props.setAttributes( { showPhone: ! props.attributes.showPhone } ); } }
              />
            </PanelRow>
          </PanelBody>
        )}
        { ! props.attributes.allBranches
          ? (<PanelBody
            title="Appel à l'action"
            initialOpen={true}
          >
            <PanelRow>
              <ToggleControl
                label="Appel à l'action"
                help={
                  props.attributes.hasCTA
                    ? "Un appel à l'action est affiché"
                    : "Aucun appel à l'action n'est affiché"
                }
                checked={ props.attributes.hasCTA }
                onChange={ () => { props.setAttributes( { hasCTA: ! props.attributes.hasCTA } ); } }
              />
            </PanelRow>
          </PanelBody>)
          : (<PanelBody
            title="Liens vers les filiales"
            initialOpen={true}
          >
            <PanelRow>
              <ToggleControl
                label="Affichage de liens"
                help={
                  props.attributes.showLink
                    ? "Un lien vers la page de chaque filiale est affiché"
                    : "Aucun lien n'est affiché"
                }
                checked={ props.attributes.showLink }
                onChange={ () => { props.setAttributes( { showLink: ! props.attributes.showLink } ); } }
              />
            </PanelRow>
            { props.attributes.showLink && (
              <PanelRow>
                <TextControl
                  label="Texte du lien"
                  help="Définissez le texte qui sera affiché pour le lien vers chaque filiale"
                  value={ linkText }
                  onChange={ linkText => setAttributes( { linkText } )}
                />
              </PanelRow>
            )}
            { props.attributes.showLink && (
              <PanelRow>
                <TextControl
                  label="Ancre du lien"
                  help="Ajoutez une ancre facultative permettant de cibler une section de la page filiale"
                  value={ linkAnchor || "" }
                  onChange={ linkAnchor => setAttributes( { linkAnchor } )}
                />
              </PanelRow>
            )}
          </PanelBody>)
        }
      </InspectorControls>
      <div { ...blockProps }
        className={blockProps.className}
      >
        <MapBlock
          showLink={showLink}
          linkText={linkText}
          linkAnchor={linkAnchor}
          allBranches={allBranches}
          acf={acf}
          branchShown={branchShown}
          hasCTA={hasCTA}
          asideTitle={asideTitle}
          allInfo={allInfo}
          showMail={showMail}
          showPhone={showPhone}
          showAddress={showAddress}
          tileServer={tileServer}
          tileAttribution={tileAttribution}
        />
      </div>
    </Fragment>);
}
