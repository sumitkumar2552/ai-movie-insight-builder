describe("IMDb Validation", () => {
  test("valid imdb id", () => {
    const regex = /^tt\d{7,8}$/;
    expect(regex.test("tt0133093")).toBe(true);
  });

  test("invalid imdb id", () => {
    const regex = /^tt\d{7,8}$/;
    expect(regex.test("abc123")).toBe(false);
  });
});