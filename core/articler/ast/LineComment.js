/** Articler -- LineComment AST node. */

import AstNode from "./AstNode.js";


/** */
export default class LineComment extends AstNode
{
    constructor(comment)
    {
        super();
        this.comment = comment;
    }


    to_html(indent = 0, indent_str = "    ")
    {
        return `<!-- ${this.comment} -->\n`.indent(indent, indent_str);
    }
}
