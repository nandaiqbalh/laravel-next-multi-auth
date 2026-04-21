"use client";

import type { ComponentPropsWithoutRef } from "react";

import { FormField } from "@/components/common/FormField";
import { Input } from "@/components/ui/input";

type InputFieldProps = ComponentPropsWithoutRef<"input"> & {
  id: string;
  label: string;
  labelClassName?: string;
  className?: string;
  inputClassName?: string;
};

export function InputField({
  id,
  label,
  labelClassName,
  className,
  inputClassName,
  ...props
}: InputFieldProps) {
  return (
    <FormField id={id} label={label} className={className} labelClassName={labelClassName}>
      <Input id={id} className={inputClassName} {...props} />
    </FormField>
  );
}
