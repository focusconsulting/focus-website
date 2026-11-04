// Copies each GFM footnote's content into a `span.sidenote` placed right after
// its reference, so wide layouts can float it into the margin. The original
// footnotes section stays in place for narrow layouts; CSS shows one or the other.

const isElement = (node, tagName) =>
  node?.type === "element" && (!tagName || node.tagName === tagName);

function findFootnotesSection(node) {
  if (isElement(node, "section") && node.properties?.dataFootnotes !== undefined) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findFootnotesSection(child);
    if (found) return found;
  }
  return null;
}

function withoutBackrefs(nodes) {
  const result = nodes
    .filter((n) => !(isElement(n, "a") && n.properties?.dataFootnoteBackref !== undefined))
    .map((n) => (n.children ? { ...n, children: withoutBackrefs(n.children) } : n));
  const last = result.at(-1);
  if (last?.type === "text") last.value = last.value.trimEnd();
  return result;
}

// Sidenotes sit inside a paragraph, so they may only hold phrasing content:
// unwrap the footnote's paragraphs and drop ids so they aren't duplicated.
function toPhrasing(nodes) {
  return nodes.flatMap((n) => {
    if (n.type === "text" && !n.value.trim()) return [];
    if (isElement(n, "p")) return toPhrasing(n.children);
    if (isElement(n)) {
      const { id, ...properties } = n.properties ?? {};
      return [{ ...n, properties, children: n.children ? toPhrasing(n.children) : [] }];
    }
    return [n];
  });
}

export default function rehypeSidenotes() {
  return (tree) => {
    const section = findFootnotesSection(tree);
    if (!section) return;

    const notes = new Map();
    const list = section.children.find((n) => isElement(n, "ol"));
    for (const item of list?.children ?? []) {
      if (!isElement(item, "li")) continue;
      notes.set(`#${item.properties.id}`, toPhrasing(withoutBackrefs(structuredClone(item.children))));
    }

    const insert = (parent) => {
      if (parent === section || !parent.children) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        const ref = isElement(node, "sup") && node.children.find(
          (c) => isElement(c, "a") && c.properties?.dataFootnoteRef !== undefined,
        );
        if (ref && notes.has(ref.properties.href)) {
          const number = ref.children.find((c) => c.type === "text")?.value ?? "";
          parent.children.splice(i + 1, 0, {
            type: "element",
            tagName: "span",
            properties: { className: ["sidenote"] },
            children: [
              { type: "element", tagName: "span", properties: { className: ["sidenote-number"] }, children: [{ type: "text", value: number }] },
              { type: "text", value: " " },
              ...structuredClone(notes.get(ref.properties.href)),
            ],
          });
          i++;
        } else {
          insert(node);
        }
      }
    };
    insert(tree);
  };
}
