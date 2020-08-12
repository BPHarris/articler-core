/** base ast node */

class AstNode
{
    constructor()
    {
        return;
    }

    to_html()
    {
        return `<p>${this}</p>`;
    }

    to_string()
    {
        return this.constructor.name;
    }

    /** javascript toString */
    toString()
    {
        return this.to_string();
    }
}
