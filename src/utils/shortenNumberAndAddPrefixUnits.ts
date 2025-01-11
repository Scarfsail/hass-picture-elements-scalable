export type ShortenNumberPrefixType = "dynamic" | "k" | "M" | "G" | "T";

export function shortenNumberAndAddPrefixUnits(value: number, units: string, type: ShortenNumberPrefixType = "dynamic"): { value: number, units: string } {

    const absVal = Math.abs(value);

    if (value == null || value == undefined || (absVal < 1000 && type == "dynamic"))
        return { value: value, units: units }

    if (absVal < 1000000 || type == "k")
        return { value: value / 1000, units: "k" + units }

    if (absVal < 1000000000 || type == "M")
        return { value: value / 1000000, units: "M" + units }

    if (absVal < 1000000000000 || type == "G")
        return { value: value / 1000000000, units: "G" + units }

    if (absVal < 1000000000000000 || type == "T")
        return { value: value / 1000000000000, units: "T" + units }


    return { value, units }

}