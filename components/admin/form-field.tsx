type FormFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
};

export function FormField({ name, label, defaultValue, placeholder, type = "text" }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={`field-${name}`} className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">
        {label}
      </label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0c] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#52525b] focus:border-[#22c55e] focus:outline-none"
      />
    </div>
  );
}
