/** articler api */

import ArticlerError from "error";
import parse from "parser";

// import * as test from "test";

import Article from "ast.article";

/**
 * Articler Article Grammar
 * 
 *      article         ::= metadata* (statement | NEWLINE)*
 *      
 *      metadata        ::= '@' metadata_tag '=' line
 *      metadata_tag    ::= 'title'
 *                      |   'author'
 *                      |   'date'
 *                      |   // TODO: What else
 * 
 *      h1              ::= '#'     line
 *      h2              ::= '##'    line
 *      h3              ::= '###'   line
 *      // TODO: h4, h5, h6
 * 
 *      p               ::= line
 *                      |   line+ NEWLINE
 * 
 *      figure          ::= '!' '[' CAPTION (',' figure_data)* ']' '(' URL ')'
 *      figure_data     ::= 'width'     '=' INT '%'
 *                      |   'rounding'  '=' INT
 * 
 *      // TODO: Full text grammar (allow i, b, u, a)
 *      text            ::= 
 *      line            ::= text NEWLINE
 * 
 *      // TODO: review this
 *      html            ::= '<' 'html' '>' ASCII* '<' '/' 'html' '>'
 * 
 *      INT             ::= [0-9]+
 *      URL             ::= [a-z A-Z 0-9 \ / - _ . : % @ ? # =]+
 *      CAPTION         ::= [a-z A-Z 0-9 \ / - _ . : % @ ? # = ( )]+
 *      ASCII           ::= printable chars in extended ascii
 */


function to_html(article)
{
    return;
}

function parse(input)
{
    return;
}
