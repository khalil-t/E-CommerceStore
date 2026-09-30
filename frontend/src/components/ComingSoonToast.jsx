import { Info } from "lucide-react";

export const ComingSoonToast = ({ title, description }) => (
	<div
		role='status'
		className='flex items-start gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 text-left shadow-lg'
		style={{ maxWidth: 320 }}
	>
		<Info size={18} className='mt-0.5 shrink-0 text-emerald-400' aria-hidden='true' />
		<span className='flex min-w-0 flex-col'>
			<span className='text-sm font-semibold leading-snug text-white'>{title}</span>
			<span className='mt-1 text-xs leading-snug text-gray-300'>{description}</span>
		</span>
	</div>
);