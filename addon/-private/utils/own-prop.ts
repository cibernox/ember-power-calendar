export default function ownProp<T = { [key: string | number]: any }>(obj: T, prop: keyof T) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
