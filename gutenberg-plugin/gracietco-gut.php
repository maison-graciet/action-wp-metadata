<?php
/**
* Plugin Name: Graciet & Co - Gutenberg
* Description: Bibliothèque de blocs Gutenberg
* Requires at least: 5.7
* Requires PHP: 7.0
* Version: 0.1.0
* Author: Graciet & Co
* License: GPL-2.0-or-later
* License URI: https://www.gnu.org/licenses/gpl-2.0.html
* Text Domain: gracietco-gut
*
* @package create-block
*/

/**
* Registers the block using the metadata loaded from the `block.json` file.
* Behind the scenes, it registers also all assets so they can be enqueued
* through the block editor in the corresponding context.
*
* @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
*/

$gcoConfig = array();
function getConfig() {
  global $gcoConfig;
  $json = file_get_contents(plugin_dir_path( __FILE__ ) . '../gracietco-gut.config.js');
  $json = str_replace("const graGutConfig = ", "", $json);
  $json = str_replace("const { global, patterns, variations, config, styles, formats } = graGutConfig;", "", $json);
  $json = str_replace("export { global, patterns, variations, config, styles, formats };", "", $json);
  $gcoConfig = json_decode($json, true);
}

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

function gracietco_gut_block_init() {
  $dir = __DIR__;

  if ( ! function_exists( 'register_block_type' ) ) {
  // Gutenberg is not active.
    return;
  }

  getConfig();
  global $gcoConfig;

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

  $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/main.asset.php');

  add_filter('script_loader_tag', function ($tag, $handle, $src) {
      if ('gracietco-gut-block-editor' !== $handle ) {
        return $tag;
      }
      $tag = '<script type="module" src="' . esc_url( $src ) . '"></script>';
      return $tag;
  } , 10, 3);

  wp_register_script(
    'gracietco-gut-block-editor',
    plugins_url( 'build/main.js', __FILE__ ),
    $asset_file['dependencies'],
    $asset_file['version']
  );

  $editor_css = 'build/main.css';
  wp_register_style(
    'gracietco-gut-block-editor',
    plugins_url( $editor_css, __FILE__ ),
    array(),
    filemtime( "$dir/$editor_css" )
  );

  // Validation SEO Styles	
  if($gcoConfig["global"]["forceValidation"]) {
    wp_register_style(
      'validation-seo',
      plugins_url('validation-seo.css', __FILE__),
      array(),
      filemtime($dir.'/validation-seo.css')
    );
    wp_enqueue_style('validation-seo');
  }

  register_block_type( 'create-block/gracietco-gut', array(
    'editor_script' => 'gracietco-gut-block-editor',
    'editor_style' => 'gracietco-gut-block-editor',
    'style' => 'gracietco-gut-block',
  ) );

  if (in_array("gco/map",$gcoConfig["global"]["allowedBlocks"])
    AND function_exists("acf_add_local_field_group")) {
    require( plugin_dir_path( __FILE__ ) . 'fields/acf-map.php');
    createCustomFields();
  }

  register_custom_block_patterns();
}

add_action( 'init', 'gracietco_gut_block_init' );

add_action('after_setup_theme', function(){
  remove_theme_support( 'core-block-patterns' );
});

add_filter( 'allowed_block_types_all', function($allowed_blocks, $context) {
  global $gcoConfig;
  if ($context->post->post_type === "template") {
    //this is a template
    return array_merge($gcoConfig["global"]["allowedBlocks"], $gcoConfig["global"]["templatesAllowedBlocks"]);
  } elseif ($context->post->post_type === "post") {
    return $gcoConfig["global"]["postsAllowedBlocks"];
  }
  return $gcoConfig["global"]["allowedBlocks"];
}, 10, 2);

function getAnchor($block) {
  if (isset($block["innerContent"][0])) {
    $anchor = preg_match( '/id="([^"]*)"/', $block["innerContent"][0], $matches );
    if ($anchor > 0) {
      return $matches[1];
    }
  }
  return false;
}

function recursiveWalk($block,$html=true) {
  $innerBlocks = array();
  foreach ($block['innerBlocks'] as $innerBlock) {
    $inner = recursiveWalk($innerBlock,$html);
    $attributes = $innerBlock["attrs"];
    if (isset($attributes["href"])) {
      $siteUrl = preg_quote(get_bloginfo('url')."/", "/");
      $attributes["href"] = preg_replace("/".$siteUrl."/", "/", $attributes["href"]);
    }
    $item = array(
      "name" => $innerBlock["blockName"],
      "attributes" => $attributes
    );
    if (count($inner) === 0) {
      if ($html) {
        $item["innerHTML"] = $innerBlock["innerHTML"];
      }
    } else {
      $item["innerBlocks"] = $inner;
    }
    $anchor = getAnchor($innerBlock);
    if ($anchor) {
      $item["anchor"] = $anchor;
    }
    $innerBlocks[] = $item;
  }
  return $innerBlocks;
}

function analyzeBlock($block, $html=true) {
  $props = array();
  $props["attributes"] = $block['attrs'];
  $anchor = getAnchor($block);
  if ($anchor) {
    $props["anchor"] = $anchor;
  }
  $props["name"] = $block["blockName"];
  $props["innerBlocks"] = recursiveWalk($block, $html);
  $json = json_encode($props, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
  /*echo $json;
  die();*/
  return '<pre class="custom-component '.str_replace("/","-",$block["blockName"]).'">'.$json.'</pre>';
}

add_filter( 'render_block', function($block_content, $block) {

  if ($block['blockName'] === 'core/table'
    && (isset($block['attrs']['autoMerge']))
    && ($block['attrs']['autoMerge'])) {
    $cell_body = "/(<td.>*?)(data-(\w*))(.*?>.*?<\/td>)/";
    $cell_head = "/(<th.>*?)(data-(\w*))(.*?>.*?<\/th>)/";
    $line = "/(<tr>)((<(td|th)>+?)(.*?<\/(td|th)>))*?(?!(<(td|th).>*?)(data-delete)(.*?>.*?<\/(td|th)>))/";
    
    $replace = "$1$3$4";
    $delete = "/(<(td|th).>*?)(data-delete)(.*?>.*?<\/(td|th)>)/";
    $output = $block_content;
    $output = preg_replace($line, "<tr data-main>$2", $output);
    $output = preg_replace($delete, "", $output);
    $output = preg_replace($cell_body, $replace, $output);
    $output = preg_replace($cell_head, $replace, $output);
    return $output;
  }
  foreach (["gco/locked-group-tabs", "gco/accordion"] as $HTMLdynamicBlock) {
    if ($block["blockName"] === $HTMLdynamicBlock) {
      return analyzeBlock($block);
    }
  }
  foreach (["core/image", "core/gallery", "core/query", "gco/map"] as $dynamicBlock) {
    if ($block["blockName"] === $dynamicBlock) {
      return analyzeBlock($block, false);
    }
  }
  if ($block["blockName"] === "core/post-terms") {
    return '<pre class="custom-component core-query">'.json_encode($block['attrs'], JSON_UNESCAPED_SLASHES).'</pre>';
  }
  return $block_content;
}, 10, 2 );

add_action( 'admin_menu', function() {
  add_menu_page( 'Blocs réutilisables', 'Blocs réutilisables', 'edit_posts', 'edit.php?post_type=wp_block', '', 'dashicons-editor-table', 22 );
});

function get_reusable_block($id) {
  $content_post = get_post($id);
  $content = apply_filters(
    'the_content',
    $content_post->post_content
  );
  return $content;
}
