/** Articler -- Figure AST node. */

import AstNode from "./AstNode.js";


/** */
export default class Figure extends AstNode
{
    constructor(caption, url, alt = "", width = null, rounding = null)
    {
        super();

        this.caption = caption;
        this.url = url;
        this.alt = alt;

        // TODO: Validate data
        this.width = width;
        this.rounding = rounding;
    }

    html_with_style()
    {
        var s_width = this.width ?  `width: ${this.width}%` : "";
        var s_rounding = this.rounding ? `rounding: ${this.rounding}px` : "";
        var html =
`<figure style="${s_width}; ${s_rounding};">
    <img src="${this.url}" alt="${this.alt}"></img>
    <figcaption>${this.caption}</figcaption>
</figure>`;
        return html;
    }

    html_without_style()
    {
        var html = 
`<figure>
    <img src="${this.url}" alt="${this.alt}"></img>
    <figcaption>${this.caption}</figcaption>
</figure>`;
        return html;
    }

    to_html(indent = 0, indent_str = "    ")
    {
        var html = (this.width || this.rounding) ?
            this.html_with_style() : this.html_without_style();
        return html.indent(indent, indent_str) + "\n";
    }
}
