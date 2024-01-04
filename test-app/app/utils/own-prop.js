export default function ownProp(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
