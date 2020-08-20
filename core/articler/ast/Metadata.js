/** Articler -- Metadata AST node. */

import "../util.js";
import AstNode from "./AstNode.js";

import {
    MetadataRepetitionError,
    MetadataFaIconMismatchError,
    CssClassOrIdExpectedError,
    UrlExpectedError,
    FontAwesomeIconExpectedError,
} from "../error.js";


/** */
export default class Metadata extends AstNode
{
    static allowed_metadata_tags = [
        "id", "title", "author", "date", "note",
        "thumbnailcaption", "thumbnailtext", "thumbnail",
        "fa-icontarget", "fa-icon",
    ];

    static repeatable_tags = ["note", "fa-icon", "fa-icontarget"];

    constructor(metadata_tag_data_pairs)
    {
        super();
        
        this.metadata = [];     // type: Array[{tag : string, data : string}]
        for (const i in metadata_tag_data_pairs)
            this.metadata.push({
                "tag"  : metadata_tag_data_pairs[i][0],
                "data" : metadata_tag_data_pairs[i][1]
            });
    }

    /** @return the first metadata.data corresponding to the given tag */
    get(tag)
    {
        for (const pair of this.metadata)
            if (pair.tag === tag)
                return pair.data;
        return null;
    }

    /** @return true if legal, ArticlerError is illegal */
    is_legal(lineno)
    {
        var seen = [];
        var fa_icon_count = 0;
        var fa_icon_target_count = 0;

        for (const pair of this.metadata)
        {
            if (seen.includes(pair.tag)
                    && !Metadata.repeatable_tags.includes(pair.tag))
                return new MetadataRepetitionError(pair.tag, lineno);
            seen.push(pair.tag);

            if (pair.tag === "fa-icon")         fa_icon_count++;
            if (pair.tag === "fa-icontarget")   fa_icon_target_count++;

            if (pair.tag === "id" && !pair.data.is_css_selector())
                return new CssClassOrIdExpectedError(pair.tag, lineno);
            if (pair.tag === "thumbnail" && !pair.data.is_url())
                return new UrlExpectedError(pair.tag, lineno);
            if (pair.tag === "fa-icon" && !pair.data.is_fa_icon())
                return new FontAwesomeIconExpectedError(pair.tag, lineno);
            if (pair.tag === "fa-icontarget" && !pair.data.is_url())
                return new UrlExpectedError(pair.tag, lineno);
        }

        if (fa_icon_count !== fa_icon_target_count)
            return new MetadataFaIconMismatchError(lineno);
        return true;
    }

    /** */
    to_html(indent = 0, indent_str = "    ")
    {
        var i = indent_str, html = "";

        html += `<div class="articler-metadata">\n`;
        for (const pair of this.metadata) {
            html += i + `<div class="metadata">\n`;
            html += i + i + `<div class="tag">${pair.tag}</div>\n`;
            html += i + i + `<div class="data">${pair.data}</div>\n`;
            html += i + `</div>\n`;
        }
        html += `</div>`
        
        return html.indent(indent, indent_str);
    }
}
