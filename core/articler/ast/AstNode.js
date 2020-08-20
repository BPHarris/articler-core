/** Articler -- AST node abstract base class. */


/** */
export default class AstNode
{
    constructor() {}

    to_html(indent = 0, indent_str = "    ")
    {
        return `<div class="ast-node">${this.to_string()}</div>`;
    }

    to_string()
    {
        return this.constructor.name;
    }
}
