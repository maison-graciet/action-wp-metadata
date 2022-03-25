import { InnerBlocks } from "@wordpress/block-editor";
import { useState, useRef } from "@wordpress/element";
import scrollParentToChild from "./scroller";
/* custom marker icon with theme colors */
import {  primaryIcon, secondaryIcon  } from "./marker";
/* map component */
import { MapContainer, TileLayer, Marker } from "@monsonjeremy/react-leaflet";

import "./leaflet.css";
import "./editor.css";

export default function MapBlock(props) {
  const {
    allBranches,
    acf,
    branchShown,
    hasCTA,
    allInfo,
    showMail,
    showPhone, 
    showAddress,
    showLink,
    innerBlock,
    linkText,
    linkAnchor,
    asideTitle,
    tileServer,
    tileAttribution
  } = props;

  const ALLOWED_BLOCKS = ["core/cover"];
  const MY_TEMPLATE = [ ["core/cover", {
    variation: "cta"
  },
  [
    [["gco/icon"], {}],
    [["core/heading"], {}],
    [["core/paragraph"], {}],
    [["core/button"], {}]
  ],
  ] ];
  
  const list = useRef();

  /* state to handle if a marker is clicked */
  const [selectedPlace, setSelectedPlace] = useState();

  const AddressSummary = (props) => {
    const { fields, link } = props;
    const name = fields.logo
      ? <img src={fields.logo.url} alt={fields.nom}/>
      : <>{ fields.nom }</>;
    const title = allBranches
      ? <summary>{name}</summary>
      : <h4>{name}</h4>;
    const addr = (<address>
      {
        (allInfo || showMail) && (
          <a href={ "mailto:"+fields.email }>{ fields.email }</a>
        )
      }
      {
        (allInfo || showPhone) && (
          <a href={ "tel:"+fields.telephone }>{ fields.telephone }</a>
        )
      }
      {
        ((allInfo || showPhone) && (fields.telephone2)) && (
          <a href={ "tel:"+fields.telephone2 }>{ fields.telephone2 }</a>
        )
      }
      {
        (allInfo || showAddress) && (
          <p className={ allBranches ? "":"mb-0"}>
            { fields.adresse1 }<br/>
            { (fields.adresse2 != "") && fields.adresse2 }
            { (fields.adresse2 != "") && (<br/>) }
            { fields.code_postal+" "+fields.ville }
          </p>
        )
      }
    </address>);
    const button =
      (showLink) && (
        <a
          href={ link+(linkAnchor ? ("#"+linkAnchor):"") }
          title={ linkText+" "+fields.nom } >
          { linkText+" "+fields.nom }
        </a> 
      );
    return (<>{title}{addr}{button}</>);
  };

  function MapPlaceholder() {
    return (
      <p>
        Carte interactive.{" "}
        <noscript>JavaScript doit être activé pour bénéficier de cette fonctionnalité.</noscript>
      </p>
    );
  }

  return (
    <>
      <aside className={ (allBranches ? " all-branches":" one-branch") }>
        { allBranches
          ? <h3>{ asideTitle }</h3>
          : <h3>Coordonnées de {
            acf.find(e => e.id === branchShown) &&
            acf.find(e => e.id === branchShown).acf.nom
          } </h3>
        }
        <ul ref={ list } className="custom-scroll">
          { acf
            .filter((e) => {
              if (allBranches) {
                return true;
              } else {
                return e.id === branchShown;
              }
            })
            .map(e =>
              (<li
                key={e.id}
              >
                { 
                  allBranches ?
                    <details
                      open={selectedPlace === e.id}
                      onToggle={
                        (event) => {
                          if (event.target.hasAttribute("open")) {
                            scrollParentToChild(list.current,event.target);
                            if (selectedPlace !== e.id) {
                              setSelectedPlace(e.id);
                            }
                          } else {
                            if (selectedPlace === e.id) {
                              setSelectedPlace(false);
                            }
                          }
                        }
                      }>
                      <AddressSummary fields={e.acf} link={e.link} />
                    </details>
                    : <AddressSummary fields={e.acf} link={e.link} />
                }
              </li>))}
        </ul>
        { (!allBranches && hasCTA && !innerBlock) && (
          <InnerBlocks 
            allowedBlocks={ALLOWED_BLOCKS}
            template={ MY_TEMPLATE }
            templateLock="insert" />
        )}
        { (!allBranches && hasCTA && innerBlock ) && (
          <div dangerouslySetInnerHTML={{ __html:innerBlock}}></div>
        )}
      </aside>
      <MapContainer
        center={[45.58, 0.32]}
        zoom={5.7}
        placeholder={<MapPlaceholder />}
        scrollWheelZoom={false}>
        {tileServer && (
          <TileLayer
            attribution={ tileAttribution.replace(/\\/g, "").replace(/&lt;/g,"<").replace(/&gt;/g,">") }
            url={ tileServer }
          />)}
        { allBranches
          ? acf.map(e => 
            (<Marker
              key={e.id}
              icon={ (selectedPlace === e.id) ? primaryIcon:secondaryIcon }
              position={[e.lat, e.long]}
              eventHandlers={{
                click:() => {
                  setSelectedPlace(e.id);
                }
              }}
            />))
          : acf
            .filter(e => e.id === branchShown)
            .map(e => 
              (<Marker
                key={e.id}
                icon={ primaryIcon }
                position={[e.lat, e.long]}
              />))
        }
      </MapContainer>
    </>
  );
}
