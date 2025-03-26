export async function viewDetailPlan(pid: number) {
  try {
    const response = await fetch(`/api/plan_detail?pid=${pid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
