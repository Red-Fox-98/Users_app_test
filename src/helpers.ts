export const getPage = (op: string, page: number) => {
    op === "+" ? page++ : page--;
    if (page < 1) return 1;
    return page;
}