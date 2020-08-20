/** articler api */

import parse_article from "./articler/parser.js";

export default to_html;
export { to_html_debug };


/**
 * Articler Article Grammar
 * 
 *      article         ::= metadata article_body
 *      
 *      metadata        ::= metadata_line+
 *      metadata_line   ::= '@' metadata_tag '=' line
 *      metadata_tag    ::= 'title'
 *                      |   'author'
 *                      |   'date'
 *                      |   'note'
 *                      |   // TODO: What else
 * 
 *      article_body    ::= (statement | NEWLINE)*
 * 
 *      heading         ::= '#'      line
 *                      |   '##'     line
 *                      |   '###'    line
 *                      |   '####'   line
 *                      |   '#####'  line
 *                      |   '######' line
 * 
 *      paragraph       ::= line
 *                      |   line+ NEWLINE
 * 
 *      figure          ::= '!''[' CAPTION (',' figure_data)* ']''('URL')'
 *      figure_data     ::= 'width'     '=' INT '%'
 *                      |   'rounding'  '=' INT
 * 
 *      // TODO: Full text grammar (allow i, b, u, a)
 *      text            ::= ASCII - {NEWLINE}   // NOTE: temporary
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


/*

HTML Format:

<div class="articler-article">

    IF to_html_debug
    <div class="articler-debug">
        FOREACH debug-info
            <p>DEBUG_INFO_TEXT: DATA</p>
    </div>
    ENDIF

    // TODO: This can be much better
    <div class="articler-metadata">
        FOREACH metadat-tag IN grammar
            <div class=METADATA-TAG>DATA</div>
    </div>

    <div class="articler-title">
        ARTICLE TITLE       // NOTE: From metadata (@title=ARTICLE TITLE)
    </div>

    ARTICLE CONTENT
        E.g.
            <h1>heading one</h1>
            <p>paragraph<p>
            <h2>heading two</h2>
            <figure>...</figure>
            <p>paragraph<p>

</div>

*/

/** @return [string] the html representation of the given article */
function to_html(article)
{
    return parse_article(article).to_html();
}

/**
 * Prepends debug information to the article html (in div.articler-debug)
 * 
 * @return [string] the html representation of the given article
 */
function to_html_debug(article)
{
    var article_html;
    
    var start_time = Date.now();
    article_html = to_html(article);
    var end_time = Date.now() - start_time;

    const empty_debug_html = `<div class="articler-debug"></div>`;
    var debug_html =
    `<div class="articler-debug">
        <div>Time Taken: ${end_time} ms</div>
    </div>`;

    return article_html.replace(empty_debug_html, debug_html);
}
