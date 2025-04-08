export const displayDifficulty = (difficulty: number) => {
    const difficulties = ["easy", "normal", "hard", "expert", "hell"];

    return difficulties[difficulty - 1];
}