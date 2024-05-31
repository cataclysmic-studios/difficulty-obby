import { ReplicatedFirst, RunService as Runtime, MarketplaceService as Market } from "@rbxts/services";

export const Assets = ReplicatedFirst.Assets;

export interface DevProductInfo {
  readonly Description: string;
  readonly PriceInRobux: number;
  readonly ProductId: number;
  readonly IconImageAssetId: number;
  readonly Name: string;
}

export function getDevProducts(): DevProductInfo[] {
  return getPageContents(Market.GetDeveloperProductsAsync());
}

export function getPageContents<T extends defined>(pages: Pages<T>): T[] {
  const contents: T[] = [];
  do {
    for (const item of pages.GetCurrentPage())
      contents.push(item);

    task.wait(0.1);
    if (!pages.IsFinished)
      pages.AdvanceToNextPageAsync();
  } while (!pages.IsFinished)

  return contents;
}

export function waitForChildren<T extends Instance>(instance: Instance, names: string[], className?: keyof Instances): T[] {
  const children: T[] = [];
  for (const name of names)
    if (className !== undefined ? instance.IsA(className) : true)
      children.push(<T>instance.WaitForChild(name));

  return children;
}

export function getCharacterParts(character: Model): BasePart[] {
  return character.GetDescendants().filter((i): i is BasePart => i.IsA("BasePart"));
}

export async function getInstancePath(instance: Instance): Promise<string> {
  let path = instance.GetFullName()
    .gsub("Workspace", "World")[0]
    .gsub("PlayerGui", "UI")[0];

  if (Runtime.IsClient()) {
    const { Player } = await import("./client");
    path = path.gsub(`Players.${Player.Name}.`, "")[0];
  }

  return path;
}