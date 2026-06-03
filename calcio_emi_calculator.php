<?php
/*
Plugin Name: EMI Calculator by Calculator.iO
Plugin URI: https://www.calculator.io/emi-calculator/
Description: Easily calculate your Equated Monthly Installment (EMI) for home, car, or personal loans. Estimate total interest and plan your repayment schedule instantly.
Version: 1.0.0
Author: www.calculator.io / EMI Calculator
Author URI: https://www.calculator.io/
License: GPLv2 or later
Text Domain: calcio_emi_calculator
*/

if (!defined('ABSPATH')) exit;

if (!function_exists('add_shortcode')) return "No direct call for EMI Calculator by www.calculator.io";

function calcio_emi_calculator_shortcode(){
    $page = 'index.html';
    return '<h2><img src="' . esc_url(plugins_url('assets/images/icon-48.png', __FILE__ )) . '" width="48" height="48">EMI Calculator</h2><div><iframe style="background:transparent; overflow: scroll" src="' . esc_url(plugins_url($page, __FILE__ )) . '" width="100%" frameBorder="0" allowtransparency="true" onload="this.style.height = this.contentWindow.document.documentElement.scrollHeight + \'px\';" id="calcio_emi_calculator_iframe"></iframe></div>';
}


add_shortcode( 'calcio_emi_calculator', 'calcio_emi_calculator_shortcode' );