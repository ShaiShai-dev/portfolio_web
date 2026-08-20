import type { SVGProps } from "react";

export function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M13.5 6.5 17.5 10.5M4 20l4.8-1 10.8-10.8a2.3 2.3 0 0 0 0-3.2l-.6-.6a2.3 2.3 0 0 0-3.2 0L5 15.2z" />
      <path d="m14.8 5.4 4 4" />
    </svg>
  );
}
