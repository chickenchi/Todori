export async function loadPlan() {
  try {
    const response = await fetch("/api/plan_list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error loading plan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load plan:", error);
    throw error;
  }
}
