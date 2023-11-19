<?php
/*
Plugin Name: CI Emi calculator
Plugin URI: https://www.calculator.io/emi-calculator/
Description: Manage loans effectively with an EMI calculator. Calculate EMIs, total interest, and assess affordability. Make informed decisions and save money.
Version: 1.0.0
Author: Calculator.io
Author URI: https://www.calculator.io/
License: GPLv2 or later
Text Domain: ci_emi_calculator
*/

if (!defined('ABSPATH')) exit;

if (!function_exists('add_shortcode')) return "No direct call for EMI Calculator by Calculator.iO";

function display_ci_emi_calculator(){
    $page = 'index.html';
    return '<h2><img src="' . esc_url(plugins_url('assets/images/icon-48.png', __FILE__ )) . '" width="48" height="48">EMI Calculator</h2><div><iframe style="background:transparent; overflow: scroll" src="' . esc_url(plugins_url($page, __FILE__ )) . '" width="100%" frameBorder="0" allowtransparency="true" onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + \'px\';" id="ci_emi_calculator_iframe"></iframe></div>';
}

add_shortcode( 'ci_emi_calculator', 'display_ci_emi_calculator' );