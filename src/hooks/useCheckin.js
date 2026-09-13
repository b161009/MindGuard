import { useState } from 'react';

export default function useCheckin(initialValue = {}) {
  const [data, setData] = useState(initialValue);

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  return { data, updateField };
}
