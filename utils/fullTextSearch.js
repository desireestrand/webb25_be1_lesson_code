
// Requires a text index on the fields you want to search in
// Is tokenized meaning if not regex will only respond to exact token matches aka words.
export function getFullTextSearch(query, useRegex = false, regexField = null) {
    if (useRegex && regexField) {
        return {
            [regexField]: {
                $regex: query,
                $options: "i",
            },
        }
    }
    return {
        $text: {
            $search: query,
        },
    }
}