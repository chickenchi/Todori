export const insertProcedure = (
  procedure: string[],
  setProcedure: (procedure: string[]) => void
) => {
  const newProcedure = [...procedure, ""];

  setProcedure(newProcedure);
};

export const removeProcedure = (
  procedure: string[],
  setProcedure: (procedure: string[]) => void,
  procedureNumber: number
) => {
  if (procedure.length === 1) {
    return;
  }

  const newProcedure = [...procedure];
  newProcedure.splice(procedureNumber, 1);

  setProcedure(newProcedure);
};

export const editProcedure = (
  describe: string,
  procedure: string[],
  setProcedure: (procedure: string[]) => void,
  procedureNumber: number
) => {
  const newProcedure = [...procedure];

  newProcedure[procedureNumber] = describe;

  setProcedure(newProcedure);
};
