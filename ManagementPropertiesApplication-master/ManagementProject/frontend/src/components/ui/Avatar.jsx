export const Avatar = ({ name }) => {
    const initials = name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?'
    return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-border text-brand-hover text-xs font-medium mr-2 flex-shrink-0">
            {initials}
        </span>
    )
}

