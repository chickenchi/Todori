export async function insertPlanDescription(planData: any) {
  try {
    const response = await fetch("/api/plan_desc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error creating plan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create plan:", error);
    throw error;
  }
}
