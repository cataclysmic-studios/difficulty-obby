import { slice } from "@rbxts/string-utils";

export function slugToPascal(slug: string): string {
  return slug.split("-")
    .map(word => word.sub(1, 1).upper() + slice(word, 1))
    .join("");
}

export function camelCaseToSpaced(camelCased: string): string {
  return camelCased.gsub("%u", " %1")[0];
}

export function pascalCaseToSpaced(pascalCased: string): string {
  return camelCaseToSpaced(pascalCased).sub(2);
}