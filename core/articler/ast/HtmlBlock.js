/** Articler -- HtmlBlock AST node. */

import AstNode from "./AstNode.js";


/** */
export default class HtmlBlock extends AstNode
{
    constructor(html)
    {
        super();
        this.html = html;
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var html = ``;

        html += `<div class="html">\n`;
        html += this.html.indent(1, indent_str) + "\n";
        html += `</div>\n`;

        return html.indent(indent, indent_str);
    }
}
