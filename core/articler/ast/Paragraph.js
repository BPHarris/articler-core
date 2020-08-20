/** Articler -- Paragraph AST node. */

import AstNode from "./AstNode.js";


/** */
export default class Paragraph extends AstNode
{
    constructor(text)
    {
        super();
        this.text = text;
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var i = indent_str, html = "";
        var line, lines = this.text.replace("\n", "\n<br>\n").split("\n");

        if (lines.length === 1)
            return indent_str + `<p>${lines[0]}</p>\n`;

        html += `<p>\n`;
        for (line of lines)
            html += i + line + "\n";
        html += `</p>\n`;
        
        return html.indent(indent, indent_str);
    }
}
