import { useState } from 'react';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

type TUseFormResult<TValues extends Record<string, string>> = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: Dispatch<SetStateAction<TValues>>;
  values: TValues;
};

export const useForm = <TValues extends Record<string, string>>(
  initialValues: TValues
): TUseFormResult<TValues> => {
  const [values, setValues] = useState<TValues>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  return { handleChange, setValues, values };
};
