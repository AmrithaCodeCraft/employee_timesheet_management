import { useState } from "react";

export default function Timesheet() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Timesheet</h1>
      <button onClick={() => setStartTime(new Date())} className="bg-green-500 text-white px-4 py-2 rounded mb-2">
        Start Work
      </button>
      <button onClick={() => setEndTime(new Date())} className="bg-red-500 text-white px-4 py-2 rounded">
        Stop Work
      </button>
      <div className="mt-4">
        {startTime && <p>Start Time: {startTime.toLocaleTimeString()}</p>}
        {endTime && <p>End Time: {endTime.toLocaleTimeString()}</p>}
      </div>
    </div>
  );
}
