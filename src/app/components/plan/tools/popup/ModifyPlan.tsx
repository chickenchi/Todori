export async function modifyPlan(planData: any) {
  try {
    const response = await fetch("/api/plan_modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(planData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error editing plan");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to edit plan:", error);
    throw error;
  }
}
