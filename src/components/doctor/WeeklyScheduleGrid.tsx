import { Button } from "@/components/ui/button";

type SlotType = "clinic" | "tele" | null;

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const WeeklyScheduleGrid = ({
  slotsByDay,
  updateSlotType,
  isEditing,
}: {
  slotsByDay: { [day: string]: { [slot: string]: SlotType } };
  updateSlotType: (day: string, slot: string, type: SlotType) => void;
  isEditing: boolean;
}) => {

  return (
    <div className="overflow-auto max-w-full border rounded-md">
      <table className="w-full border-collapse table-fixed text-center">
        <thead>
          <tr>
            <th className="border px-1 py-0.5 sticky top-0 bg-white z-10 text-xs">Time</th>
            {daysOfWeek.map(day => (
              <th key={day} className="border px-1 py-0.5 sticky top-0 bg-white z-10 text-xs">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(slot => (
            <tr key={slot}>
              <td className="border px-1 py-0.5 font-semibold text-xs">{slot}</td>
              {daysOfWeek.map(day => {
                const slotType = slotsByDay[day]?.[slot] || null;
                return (

                  <td key={day + slot} className="border px-1 py-0.5">
                    {isEditing ? (
                      <select
                        value={slotType || ""}
                        onChange={(e) => updateSlotType(day, slot, e.target.value === "" ? null : (e.target.value as SlotType))}
                        className="w-full text-xs p-1 border rounded"
                      >
                        <option value="">None</option>
                        <option value="clinic">Clinic</option>
                        <option value="tele">Tele</option>
                      </select>
                    ) : (
                      slotType ? (
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${slotType === "clinic" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800"
                            }`}
                        >
                          {slotType === "clinic" ? "Clinic" : "Tele"}
                        </span>
                      ) : null
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
};

export default WeeklyScheduleGrid;
