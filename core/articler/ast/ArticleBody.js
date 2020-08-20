/** Articler -- ArticleBody AST node. */

import AstNode from "./AstNode.js";


/** */
export default class ArticleBody extends AstNode
{
    constructor(statements)
    {
        super();
        this.statements = statements;
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var html = "", statement;

        html += `<div class="articler-body">\n`;
        for (statement of this.statements)
            html += statement.to_html(1, indent_str) + "\n";
        html += `</div>`

        return html.indent(indent, indent_str);
    }
}
