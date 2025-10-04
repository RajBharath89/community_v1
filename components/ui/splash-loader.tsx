"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type SplashLoaderProps = {
	quotes?: string[];
	intervalMs?: number;
	imageSrc?: string;
	alt?: string;
};

export default function SplashLoader({
	quotes = [
		"Shraddha (Faith) and Saburi (Patience) are the two coins to reach me.",
		"Why fear when I am here?",
		"Have faith and patience; then I will be always with you.",
		"I give people what they want so I can give them what they need.",
	],
	intervalMs = 2500,
	imageSrc = "/sai-baba-serene-face-with-orange-turban-and-peacef.png",
	alt = "Sai Baba",
}: SplashLoaderProps) {
	const [index, setIndex] = useState(0);
	const nonEmptyQuotes = useMemo(
		() => quotes.filter((q) => q && q.trim().length > 0),
		[quotes]
	);

	useEffect(() => {
		if (nonEmptyQuotes.length <= 1) return;
		const id = setInterval(() => {
			setIndex((prev) => (prev + 1) % nonEmptyQuotes.length);
		}, intervalMs);
		return () => clearInterval(id);
	}, [intervalMs, nonEmptyQuotes.length]);

	const currentQuote = nonEmptyQuotes[index] ?? "Loading...";

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
			<div className="flex w-full max-w-xl flex-col items-center gap-6 px-6 text-center">
				<div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-primary/20">
					<Image
						src={imageSrc}
						alt={alt}
						fill
						sizes="112px"
						className="object-cover"
						priority
					/>
				</div>

				<p className="min-h-[64px] text-balance text-base text-muted-foreground transition-opacity">
					“{currentQuote}”
				</p>

				<div className="flex items-center gap-2 text-primary">
					<span className="sr-only">Loading</span>
					<div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
					<div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
					<div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
				</div>
			</div>
		</div>
	);
}


