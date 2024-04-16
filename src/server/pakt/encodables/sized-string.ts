import { slice } from "shared/utility/array";
import { isUShort } from "shared/utility/numbers";
import { Encodable, InvalidEncodableException } from "../encodable";
import type { BinaryReader } from "shared/classes/binary-reader";
import { Number } from "./number";

// max length 2 ^ 16 (65536)
export class SizedString extends Encodable {
  public constructor(
    private readonly value: string,
    private readonly length: ushort = value.size()
  ) { super(); }

  public static parse(reader: BinaryReader): string {
    const length = reader.readUShort();
    print(length)
    const value = reader.readString(length);
    const sizedString = new SizedString(value, length);
    sizedString.validate();

    return value;
  }

  public encode(): Buffer {
    const lengthBytes = new Number(this.length, 2).encode();
    print(lengthBytes)
    const characters = this.value.split("");
    const stringBytes = characters.map<byte>(char => utf8.codepoint(char)[0]);
    const paddedStringBytes = slice(stringBytes, 0, this.length);

    return [
      ...lengthBytes,
      ...paddedStringBytes
    ];
  }

  public validate(): void {
    this.validateExpression(isUShort(this.length), "length");
    this.validateExpression(this.value.size() === this.length, "value");
  }

  protected validateExpression<T extends boolean>(expression: T, fieldName: string): void {
    if (expression) return;
    throw new InvalidEncodableException("SizedString", fieldName);
  }
}