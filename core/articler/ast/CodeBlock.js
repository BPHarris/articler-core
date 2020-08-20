/** Articler -- CodeBlock AST node. */

import AstNode from "./AstNode.js";


/** */
export default class CodeBlock extends AstNode
{
    constructor(code)
    {
        super();
        this.code = code;
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var html = ``;

        html += `<code>\n`;
        html += this.code.indent(1, indent_str) + "\n";
        html += `</code>\n`;

        return html.indent(indent, indent_str);
    }
}
