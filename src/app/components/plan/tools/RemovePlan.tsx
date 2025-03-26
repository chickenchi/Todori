export async function removePlan(planData: any) {
  try {
    const response = await fetch("/api/plan_remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error removing plan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to remove plan:", error);
    throw error;
  }
}
