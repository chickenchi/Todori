export async function partialUpdatePlan(planData: any) {
  try {
    const response = await fetch("/api/plan_partial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating plan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update plan:", error);
    throw error;
  }
}
