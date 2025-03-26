export async function searchPlan(query: string, order: string) {
  try {
    const response = await fetch(
      `/api/plan_search?query=${query}&order=${order}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error loading plan detail");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load plan detail:", error);
    throw error;
  }
}
