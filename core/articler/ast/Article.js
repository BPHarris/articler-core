/** Articler -- Article AST node. */

import AstNode from "./AstNode.js";

import "../util.js";


/** */
export default class Article extends AstNode
{
    constructor(metadata, article_body)
    {
        super();

        this.metadata = metadata;               // type: Metadata
        this.article_body = article_body;       // type: ArticleBody
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var i = indent_str, html = "";
        var id = this.metadata.get("id");
        var title = this.metadata.get("title");

        html += `<div class="articler-article" id="${id}">\n`;
        html += i + `<div class="articler-debug"></div>\n`;
        html += `\n`;
        html += `${this.metadata.to_html(1, i)}\n`;
        html += `\n`;
        html += `${i}<div class="articler-title">${title}</div>\n`;
        html += `\n`;
        html += `${this.article_body.to_html(1, i)}\n`;
        html += `</div>`;

        return html.indent(indent, indent_str);
    }
}
