import scenario from "../scenario.json" assert { type: "json" };

export default defineEventHandler(() => {
  
  const rooms = (scenario.rooms || []).map((r: any) => ({
    id: r.id,
    name: r.name,
  }));
  return { rooms };
});
