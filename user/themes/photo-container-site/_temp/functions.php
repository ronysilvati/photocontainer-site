<?php
// function gen_data() {
//  $title = [
//    'Curabitur',
//    'Vestibulum',
//    'Sed sagittis',
//    'Mauris sit amet',
//    'Suspendisse',
//    'Nullam orci pede',
//    'Nam congue',
//    'Integer aliquet',
//    'Maecenas pulvinar lobortis',
//    'Curabitur'
//  ];
// }

function get_colors() {
  $colors = [
    ['Branco',             '#FFFFFF'],
    ['Pele',               '#FAF1E4'],
    ['Milão',              '#FFFFA3'],
    ['Ouro',               '#FFD200'],
    ['Laranja',            '#FFA400'],
    ['Pera',               '#ED742E'],
    ['Escarlate',          '#FF1A00'],
    ['Roxo',               '#FF00D2'],
    ['Rosa',               '#F9C0EB'],
    ['Azul Hawkes',        '#CAC9FC'],
    ['Violeta',            '#6E1BDF'],
    ['Azul Bahama',        '#08679E'],
    ['Azul Dodger',        '#3BA2FF'],
    ['Azul Vela',          '#B9E2FB'],
    ['Turquesa ',          '#33D4D6'],
    ['Verde hortelã',      '#BAF9C6'],
    ['Arlequim',           '#39D200'],
    ['Verde musgo',        '#029239'],
    ['Castanho',           '#7F5843'],
    ['Prata',              '#A3A3A3'],
    ['Preto',              '#000000'],
    ['Grama dourada',      '#E49F2D'],
    ['Linho',              '#EDCC83'],
    ['Cinza',              '#D5D3D3']
  ];

  return $colors;
}

function get_component($path="", $vars=null) {
    if( is_array($vars) ) {
      foreach( $vars as $key=>$var ) {
      $$key = $var;
    }
  }
  return (include ("components/".$path.".php"));
}

?>
