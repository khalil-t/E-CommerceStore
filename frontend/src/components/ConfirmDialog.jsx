import { motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

export const ConfirmDialog = ({ isOpen, title, description, confirmLabel, cancelLabel = "Cancel", onConfirm, onCancel }) => {
	const dialogRef = useRef(null);
	const previouslyFocused = useRef(null);
	const titleId = useId();
	const descriptionId = useId();

	useEffect(() => {
		if (!isOpen) return;

		previouslyFocused.current = document.activeElement;
		const dialog = dialogRef.current;
		dialog?.focus();

		const bodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				e.stopPropagation();
				onCancel();
				return;
			}

			if (e.key !== "Tab" || !dialog) return;

			const focusables = dialog.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (!focusables.length) return;

			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = bodyOverflow;
			previouslyFocused.current?.focus?.();
		};
	}, [isOpen, onCancel]);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div
				className='absolute inset-0 bg-black bg-opacity-60'
				aria-hidden='true'
				onClick={onCancel}
			/>
			<motion.div
				ref={dialogRef}
				role='dialog'
				aria-modal='true'
				aria-labelledby={titleId}
				aria-describedby={descriptionId}
				tabIndex={-1}
				initial={{ opacity: 0, scale: 0.96 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.15 }}
				className='relative w-full max-w-md outline-none rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl'
			>
				<h2 id={titleId} className='text-lg font-semibold text-white'>
					{title}
				</h2>
				{description && (
					<p id={descriptionId} className='mt-2 text-sm leading-snug text-gray-300'>
						{description}
					</p>
				)}
				<div className='mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
					<button
						type='button'
						onClick={onCancel}
						className='flex items-center justify-center rounded-lg bg-gray-700 px-5 py-2.5
							text-sm font-medium text-white transition duration-300 ease-in-out
							hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
					>
						{cancelLabel}
					</button>
					<button
						type='button'
						onClick={onConfirm}
						className='flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5
							text-sm font-medium text-white transition duration-300 ease-in-out
							hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
					>
						{confirmLabel}
					</button>
				</div>
			</motion.div>
		</div>
	);
};