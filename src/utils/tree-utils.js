/**
 * Indicate whether an ID matches the given item or one of its children, or not.
 *
 * @param {Object} item Item data
 * @param {String} id   ID of the item to find
 * @return {Boolean} `true` if `id` matches item or one of its children
 */
export function contains(item, id) {
  return (
    item.id === id ||
    (item.children ? item.children.some(child => contains(child, id)) : false)
  );
}
