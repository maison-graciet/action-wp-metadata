# Plugin Gutenberg

## TODO

 * rendre le changement de css lié au SEO programmatique
 * améliorer la validation SEO en fonction du type de post :
    * désactiver la question des titres / longueur de contenu pour les templates
    * désactiver le h1 pour les posts
 * créer des patterns utiles
 * organiser les catégories
 * revoir la nomenclature
 * améliorer les exemples

## Présentation générale

Ce plugin constitue une bibliothèque de blocs pour l'éditeur visuel Gutenberg.

Le moins possible de blocs sont développés à partir de 0. On utilise au maximum
les blocs natifs, dont les possibilités peuvent être augmentés aux moyens de filtres.

On peut également créer des variations de blocs afin de générer *au sens de l'utilisateur*,
c'est-à-dire que l'on voit plusieurs blocs dans l'UI de l'éditeur, mais du point
de vue du développeur ce n'est qu'un seul bloc, et réduit donc le travail de
maintenance nécessaire.

## Hiérarchie

```
fields/                     dossier permettant de déclarer des champs custom (ACF)
patterns/                   dossier de déclaration des patterns
src/                        source des blocs
  00-debug/                 chaque dossier est un bloc développé suivant la même structure
    edit.js                 fonction d'édition
    index.js                point d'entrée et métadonnées du bloc
    save.js                 fonction de sauvegarde
  01-icon/
  02-coordinate/
  03-iconText/
  04-tab/
  05-lockedGroup/
  b09-accordionBlock/
  b09-accordionItem/
  b12-externalContent/
  b13-form/
  b16-map/
  b17-carousel/
  extensions/               dossier qui rassemble les différentes extensions réalisés sur les blocs natifs ou l'éditeur lui-même
    index.js                point d'entrée avec tous les imports et configuration générale
    buttons.js
    cover.js
    gallery.js
    gravityForms.js
    group.js
    heading.js
    html.js
    image.js
    list.js
    paragraph.js
    post-terms.js
    query.js
    quote.js
    spacer.js
    table.js
    validation.js           fichier gérant la validation SEO pré-publication
  editor.scss               feuille de style principale
  iconSelector.js           composant de sélection d'icônes
  icons.js                  icônes des blocs
  index.js                  point d'entrée avec tous les imports
README.md                   la présente documentation
gracietco-gut.config.dist.json  exemple de fichier de configuration
gracietco-gut.php           point d'entrée du plugin
package.json 
package-lock.json
```

## Points à noter du fonctionnement

### Fichier de configuration

La configuration du plugin se fait au moyen du fichier de configuration
`gracietco-gut.config.json` situé dans le **dossier parent** du plugin.
Un exemple de configuration est fourni sous `./gracietco-gut.config.dist.json`.

Ce fichier JSON est organisé autour de 6 clefs :

 * `global` : contient des informations de configurations générales, en particulier
la liste des [blocs autorisées](https://developer.wordpress.org/reference/hooks/allowed_block_types_all/).
 * `patterns` : décrit les [patterns](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/)
(ou compositions) et leurs catégories qui doivent être enregistrés
 * `variations` : liste les variations autorisées. Cela permet de désactiver à
volonté certains [variations](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/).
 * `config` : contient des configurations blocs par blocs, permettant le plus
souvent d'activer ou non certaines options, ou de régler certains paramètres sur
lesquels l'utilisateur n'a pas à avoir le contrôle.
 * `styles` : liste l'ensemble des [styles](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/)
disponibles pour chaque bloc.
 * `formats` : liste l'ensemble des [formats autorisés](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-rich-text/#unregisterformattype).

#### Global

Le booléen `forceValidation` permet l'activation d'une vérification SEO des contenus
préalable à la publication. Le CSS activé avec cette variable est disponnible dans le fichier `validation-seo.css`.

```
/* validation UI */
.site-editor-php .edit-post-header button.components-button.editor-post-publish-button,
.site-editor-php .edit-post-header button.components-button.editor-post-publish-button__button {
  display: none;
}

#validateBtn.is-valid {
  display: none;
}

#validateBtn.not-valid ~ button.components-button.editor-post-publish-button,
#validateBtn.not-valid ~ button.components-button.editor-post-publish-button__button {
  display: none;
}

#validateBtn.is-valid ~ button.components-button.editor-post-publish-button,
#validateBtn.is-valid ~ button.components-button.editor-post-publish-button__button {
  display: flex;
}
```

Cette validation est gérée dans le fichier `./src/extensions/validation.js`.

La clé `categories` contient un `array` des catégories de blocs. Chaque cétégorie
est structurée de la façon suivante :

```
{
  "slug": "devel",
  "label": "Développement"
}
```

Ces catégories sont ensuite enregistrées *via* le fichier PHP `./gracietco-gut.php` :

```
add_filter( 'block_categories_all', function($block_categories, $editor_context) {
  if (!empty($editor_context->post)) {
    global $gcoConfig;

    foreach ($gcoConfig["global"]["categories"] as $category) {
      array_push(
        $block_categories, array(
          'slug'  => $category["slug"],
          'title' => __( $category["label"], 'gracietco-gut' ),
          'icon'  => null,
        )
      );
    }
  }
  return $block_categories;
}, 10, 2 );
```

La clé `allowedBlocks` est une liste de tous les blocs autorisés, appliquée dans
le fichier PHP `./gracietco-gut.php` :

```
add_filter( 'allowed_block_types_all', function($allowed_blocks) {
  global $gcoConfig;
  return $gcoConfig["global"]["allowedBlocks"];
});
```

#### Patterns

La clé `patterns` décrit les compositions et leurs catégories :

```
"patterns": {
  "categories": [
    ...
  ],
  "list": [
    ...
  ]
}
```

Les catégories sont décrites de la même façon que les catégories de blocs.
Chaque pattern dans `list` possède la structure suivante :

```
{
  "active": true,
  "slug": "quote_group_img",
  "title": "Groupe de témoignages avec portraits",
  "categories": ["classic"],
  "description": "Positionnez un ensemble de témoignages"
}
```

La clé `slug` doit impérativement faire référence à un des fichiers HTML présents
dans `./patterns/`. Chacun de ses fichiers ne contient pas une page web complète
mais uniquement le fragment pertinent. Par exemple, pour le pattern ci-dessus,
on a le fichier `./patterns/quote_group_img.html` :

```
<!-- wp:group {"tagName":"div","className":"quote_group"} -->
<div class="wp-block-group quote_group">
  <!-- wp:quote {"hasImage":true} -->
  <blockquote class="wp-block-quote">
    <p>Vivamus leo. Ut in risus volutpat libero pharetra tempor. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Vivamus leo.</p>
    <cite>Jean-Michel LeClient<br><strong>Commercial</strong><br><strong>Entreprise SAS</strong></cite><!-- wp:image -->
    <figure class="wp-block-image size-full"><img src="data:image/png;base64,..." alt=""/></figure>
    <!-- /wp:image -->
  </blockquote>
  <!-- /wp:quote -->
  <!-- wp:quote {"hasImage":true} -->
  <blockquote class="wp-block-quote">
    <p>Vivamus leo. Ut in risus volutpat libero pharetra tempor. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Vivamus leo.</p>
    <cite>Jean-Michel LeClient<br><strong>Commercial</strong><br><strong>Entreprise SAS</strong></cite><!-- wp:image -->
    <figure class="wp-block-image size-full"><img src="data:image/png;base64,..." alt=""/></figure>
    <!-- /wp:image -->
  </blockquote>
  <!-- /wp:quote -->
  <!-- wp:quote {"hasImage":true} -->
  <blockquote class="wp-block-quote">
    <p>Vivamus leo. Ut in risus volutpat libero pharetra tempor. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Vivamus leo.</p>
    <cite>Jean-Michel LeClient<br><strong>Commercial</strong><br><strong>Entreprise SAS</strong></cite><!-- wp:image -->
    <figure class="wp-block-image size-full"><img src="data:image/png;base64,..." alt=""/></figure>
    <!-- /wp:image -->
  </blockquote>
  <!-- /wp:quote -->
</div>
<!-- /wp:group -->
```

Cette gestion des patterns se fait dans le fichier PHP `./gracietco-gut.php` :

```
function register_custom_block_patterns() {
  global $gcoConfig;
  //register pattern categories
  foreach ($gcoConfig["patterns"]["categories"] as $category) {
    register_block_pattern_category($category["slug"], array("label" => $category["label"]));
  }
  foreach ($gcoConfig["patterns"]["list"] as $pattern) {
    if ($pattern["active"]) {
      register_block_pattern('gracietco-gut/'.$pattern["slug"], array(
        'title' => $pattern["title"],
        "categories" => $pattern["categories"],
        "description" => $pattern["description"],
        "content" => file_get_contents(plugin_dir_path( __FILE__ ) . './patterns/' . $pattern["slug"] . '.html')
      ));
    }
  }
}
```

#### Variations

L'objet `variations` décrit l'ensemble des variations qui doivent être activées.
Les clefs sont le nom des blocs associé à une liste de variations :

```
"variations": {
  "core/paragraph": ["notification", "catchphrase"]
}
```

Cette liste est ensuite utilisée afin de filtrer la liste des variations disponibles
lors de leur enregistrement, par exemple :

```
import { variations as variationsConfig } from "../../../gracietco-gut.config.json";

...
settings.variations = settings.variations.filter(e => variationsConfig["core/paragraph"].includes(e.name));
```

#### Configuration

Les clefs sont le nom des blocs, elles sont associées à un objet permettant de
déclarer des paramètres personnalisés.

Cette configuration est ensuite importée dans le `edit` ou le `save` des blocs
concernés, par exemple :

```
import { config as conf } from "../../../gracietco-gut.config.json";
const config = conf["b16-map"];
```

#### Styles

Il s'agit d'une liste permettant de proposer des styles pour les différents blocs.
Par exemple :

```
"core/paragraph": [
  {
    "name": "has-shadow",
    "label": "Ombre"
  }
],
```

**NB :** la clé "name" est reprise pour appliquer la classe qui permet d'appliquer
le style.

Ces styles sont appliqué via le fichier `src/extensions/index.js` :

```
import { styles } from "../../../gracietco-gut.config.json";

const fixStyles = (blocks) => {
  blocks.forEach(block => {
    if (block.styles.length) {
      block.styles.forEach(style => {
        wp.blocks.unregisterBlockStyle(block.name, style.name);
      });
    }
  });
  Object.entries(styles).forEach(block => {
    if (block[0] === "//") {
      return;
    }
    block[1].forEach(style => {
      wp.blocks.registerBlockStyle(block[0], style);
    });
  });
}
```

Tous les styles natifs sont dé-registrés avant d'enregistrer les styles de blocs
de la configuration.

#### Formats

Liste les formats du composant `RichText` à supprimer :

```
"formats": {
  "remove": ["core/code", "core/image", "core/text-color", "core/keyboard"]
}
``` 

La gestion des formats est appliquée dans le fichier `src/extensions/index.js` :

```
import { formats } from "../../../gracietco-gut.config.json";

const fixFormats = () => {
  formats.remove.forEach(toRemove => {
    wp.richText.unregisterFormatType(toRemove);
  });
}
```

### Blocs dynamiques

Certains blocs sont destinés à recevoir un traitement dédié lors de l'affichage
par le client (par exemple, affichage des dernières actualités ou bloc interactif
tel que la liste d'onglets).

Pour cela, on applique le traitement suivant dans le fichier `./gracietco-gut.php` :

```
add_filter( 'render_block', function($block_content, $block) {
  if ($block["blockName"] === $dynamicBlock) {
    $attributes = $block['attrs'];
    $attributes["structure"] = recursiveWalk($block, false);
    return '<pre class="custom-component '.str_replace("/","-",$dynamicBlock).'">'.json_encode($attributes, JSON_UNESCAPED_SLASHES).'</pre>';
  }
});
```

De cette façon les attributs ainsi que ceux des innerBlocks sont injectés dans
une balise `pre` sous la forme d'un JSON. Celui-ci pourra être intercepté côté
client pour être rendu de la façon attendue. Dans notre thème Gatsby, c'est le composant
`parser` qui gère cela : `src/components/parser.js`.

### Variations

On peut injecter du contenu lorsque l'on souhaite modifier l'`edit` d'un bloc de
la façon suivante :

```
<div { ...useBlockProps() }>
  <BlockEdit {...props} />
  // insérer ici le contenu supplémentaire
</div>
```

Cela ne fonctionne pas pour le bloc `core/group`. Pour contourner ce problème,
le bloc `gco/locked-group` a été créé. Il agit comme un wrapper qui permet de
créer un "groupe verrouillé" dont on peut passer en attribut les attributs d'un
`InnerBlocks` afin de généré un groupe dont on peut limiter les éléments enfants
à un certain type de blocs.

En réalité, ce bloc n'est jamais enregistré tel quel, et ce ne sont pas des variations
qui sont utilisées, mais plutôt des sortes de "blocs enfants".
On boucle pour créer de véritables blocs à partir des définitions qui auraient pu
être utilisées pour créer des variations. Ainsi, `gco/locked-group` n'existe pas,
mais `gco/locked-group-icon-grid` ou `gco/locked-group-tab` existent.

Pour le bloc `core/query` pour lequel on a généré
la variation "Remontée d'actualités", et on "cache" le bloc `core/query` pour 
n'afficher que la variation en la déclarant comme variation par défaut :

```
  isDefault: true,
``` 


### Sélecteur d'icônes

Un composant de sélecteur d'icônes est disponibles sous `./src/iconSelector.js`.
Il peut être réutilisé directement à l'intérieur des blocs. C'est le cas pour la
variation "notification" du bloc `core/paragraph`.
On peut également l'utiliser sous la forme d'un bloc dédié, c'est le bloc `gco/icon`.

Les icônes sont automatiquement récupérées à partir de la feuille de style du thème
courant, en extrayant toutes les classes liées à la classe `.icon`.

### CSS

Le fichier `./src/editor.scss` permet de personnaliser l'affichage de l'éditeur
de blocs.

Plusieurs modifications notables sont apportées :

 * Le panneau latéral des paramètres des blocs est élargi pour prendre un tiers
 de la largeur de l'écran. Les composants `<PanelBody>` sont disposés sur deux
 colonnes.
 * On peut cibler le panneau latéral d'un bloc en particulier à l'aide du selecteur
 `[data-block]`, et une variation à l'aide de `[data-variation]`. Par exemple,
 pour cibler les paramètres du bloc `core/paragraph` dans sa variation "notification",
 on pourra faire : `.interface-interface-skeleton__sidebar[data-block="core/paragraph"][data-variation="notification"]`
 * On peut cibler de la même façon la barre d'outil des blocs (`.block-editor-block-contextual-toolbar`).
 * On profitera de ces possibilités pour masquer le maximum d'options inutiles
 à l'utilisateur.

### Extensions générales

Le fichier `./src/extensions/index.js` importe les différentes extensions de blocs.
Il apporte également, nous l'avons vu, des modifications à l'éditeur en lui-même
(système de validation SEO par exemple). Ces modifications sont apportées via
un "hook" personnalisé, exécuté lorsque l'éditeur a terminé son chargement :

```
const closeListener = wp.data.subscribe(() => {
  let ready = false;
  try {
    ready = wp.data.select("core/editor").__unstableIsEditorReady();
  } catch {
    //~ NoOp
  }
  if (ready) {
    //~ On exécute ici l'ensemble des fonctions nécessaires
  }
});
```

Les fonctions exécutées par ce hook sont les suivantes :

 * suppression des styles par défaut
 * suppression des formats indésirables
 * ajout des attributs `[data-block]` et `[data-variation]` sur la barre d'outil et
 le panneau latéral des paramètres
 * mise en place du système de validation SEO pré-publication
 
### Validation SEO

La validation SEO remplace le bouton "mise à jour" ou "publier" par un bouton
"valider". Il n'existe pas de méthode native de Wordpress pour faire cela, c'est
donc géré en JS natif et en CSS. On cible le bouton original, on insère avant
un nouveau bouton. Selon que ce bouton possède la classe `is-valid`, on affiche ou
non le bouton de publication.

Au clic sur le bouton, on exécute la fonction `validatePost()`. Cette fonction
récupère le contenu de l'éditeur (soit via
`wp.data.select("core/editor").getEditedPostContent()`, soit via
`wp.data.select("core/block-editor").getBlocks()`), et exécute ensuite une série
de règles, configurés dans `validationRules`. Chaque règle contient un test (la
fonction a exécuter pour vérifier si le contenu est conforme à la règle), un
niveau d'erreur et un message d'erreur. On peut également passer une action
qui permet d'afficher un bouton pour éventuellement corriger l'erreur :

```
{
  test: () => {},
  noticeMessage: "Message d'erreur",
  noticeType: "error",
  noticeActions: [{
    label: "Corriger",
    variant: "primary",
    onClick: () => {
    }
  }]
}
```

En fonction du résultat de la validation, on affiche une [notice](https://developer.wordpress.org/block-editor/reference-guides/components/notice/).
Seules les notices de type `error` seront bloquantes et empêchent la publication
du contenu. Les autres sont de simples avertissements.

Les notices sont affichées avec la fonction suivante :

```
const showNotice = (validation) => {
  wp.data.dispatch("core/notices").removeNotice("gco-gut-lock");
  const z = wp.data.dispatch("core/notices").createNotice(
    validation.noticeType,
    validation.noticeMessage,
    { id: "gco-gut-lock", isDismissible: validation.noticeType !== "error", actions: validation.noticeActions }
  );
}
```

Suite à une validation, lorsque le contenu est à nouveau modifié, on supprime la
notice en cours et on repasse à l'état initial, en attente d'une nouvelle validation.
Cela se fait en souscrivant aux mises à jour de l'éditeur :

```
const subscribeToEditorChanges = (validationBtn) => {
  let postContent = "";
  const unsubscribe = wp.data.subscribe(() => {
    const content = wp.data.select("core/editor").getEditedPostContent();
    if (content !== postContent) {
      ...
    }
  });
}
```
