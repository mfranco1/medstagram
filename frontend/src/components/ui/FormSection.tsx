interface FormSectionProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function FormSection({ title, children, className = '' }: FormSectionProps) {
  return (
    <div className={`col-span-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )
} 