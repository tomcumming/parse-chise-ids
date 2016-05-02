import * as ids from 'parse-ids';
import * as fs from 'fs';

export type Definition = {
    related: string,
    ids: ids.IDS
}

const lineRegex = /(\S+)\s+(\S+)\s+(\S+)/;

/**
 * Parse all the IDS (.txt) files in a given directory 
 */
export function parseDirectory(directory: string, logErrors = false): Map<string, Definition> {
    var ret = new Map<string, Definition>();

    const files = fs.readdirSync(directory)
        .filter(file => file.endsWith('.txt'));
    files.forEach(file => {
        var fileDefs = parseFile(directory, file, logErrors);
        fileDefs.forEach((def, name) => ret.set(name, def));
    });

    return ret;
}

export function parseFile(directory: string, filename: string, logErrors = false): Map<string, Definition> {
    const content = fs.readFileSync(directory + '/' + filename, 'utf-8');
    return parse(content, logErrors ? filename : undefined);
}

export function parse(contents: string, errorContext?: string): Map<string, Definition> {
    const lines = contents.split('\n');

    const ret = new Map<string, Definition>();

    function errorMessage(ln: number, msg: string) {
        if (errorContext !== undefined)
            console.log(errorContext + ':' + ln + ': ' + msg);
    }

    lines.forEach((line, ln) => {
        if (line.startsWith(';;') || line === '')
            return; // Skip comments / blanks

        const match = lineRegex.exec(line);
        if (match === null) {
            errorMessage(ln + 1, 'Line format incorrect');
            return;
        } else {
            const seq = ids.parse(match[3]);
            if (seq === null) {
                errorMessage(ln + 1, 'Could not parse sequence: ' + match[3]);
                return;
            } else {
                ret.set(match[1], { related: match[2], ids: seq });
            }
        }
    });

    return ret;
}

/**
 * Get the chise encoded name for a character
 */
export function chiseName(character: string): string {
    if (character.charAt(0) === '&')
        return character.substr(1, character.length - 2);

    const cp = character.codePointAt(0);
    const hex = cp.toString(16).toUpperCase();
    const padding = hex.length % 4 === 0 ? '' : '0'.repeat(4 - hex.length % 4);
    const head = cp > 0xffff ? 'U-' : 'U+';
    return head + padding + hex;
}
