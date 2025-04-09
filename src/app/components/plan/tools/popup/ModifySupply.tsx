export const insertSupply = (
  supply: string,
  supplyCount: string,
  desc: Set<Record<string, number>>,
  setDesc: (desc: Set<Record<string, number>>) => void
) => {
  const count = isNaN(parseInt(supplyCount)) ? 1 : parseInt(supplyCount);

  if (count < 1) return;

  const newItem: Record<string, number> = {
    [supply]: count,
  };

  const updatedSet = new Set(desc);

  let found = false;

  updatedSet.forEach((item) => {
    if (item[supply] !== undefined) {
      item[supply] = count;
      found = true;
    }
  });

  if (!found) {
    updatedSet.add(newItem);
  }

  setDesc(updatedSet);
};

export const removeSupply = (supply: string, setDesc: (desc: any) => void) => {
  setDesc((prev: any) => {
    if (prev instanceof Set) {
      const newPrev = new Set(prev);

      newPrev.forEach((item) => {
        if (Object.keys(item)[0] === supply) {
          newPrev.delete(item);
        }
      });

      return newPrev;
    }

    return prev;
  });
};
