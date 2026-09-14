export function validItem(x) {
  return x && typeof x.id === 'string' && x.id.length <= 100 &&
    ['text', 'rich', 'link', 'image', 'file'].includes(x.type) &&
    typeof x.title === 'string' && x.title.length <= 200 &&
    typeof x.content === 'string' && x.content.length <= 1000000 &&
    typeof x.device === 'string' && x.device.length <= 100 &&
    Number.isFinite(x.ts) && Number.isFinite(x.updatedAt) &&
    ['pinned', 'fav', 'deleted'].every(k => typeof x[k] === 'boolean') &&
    typeof x.mutation === 'string' && x.mutation.length <= 100 &&
    Number.isSafeInteger(x.rev ?? 0) && (x.rev ?? 0) >= 0 &&
    JSON.stringify(x).length <= 3 * 1024 * 1024 &&
    (!x.meta?.dataUrl || (typeof x.meta.dataUrl === 'string' &&
      (x.type === 'image' ? /^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/ : /^data:[\w.+/-]*;base64,[A-Za-z0-9+/=]*$/).test(x.meta.dataUrl)));
}
