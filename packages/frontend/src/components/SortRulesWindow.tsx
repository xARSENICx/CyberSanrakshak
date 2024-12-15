"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { SortOption } from "@/types/rules";

interface BlocksSortProps {
	value: SortOption;
	onValueChange: (value: SortOption) => void;
}

export function BlocksSort({ value, onValueChange }: BlocksSortProps) {
	return (
		<div className='space-y-2'>
			<Label>Sort By</Label>
			<Select
				value={value}
				onValueChange={onValueChange}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='hostname'>Host Name</SelectItem>
					<SelectItem value='application'>Application Name</SelectItem>
					<SelectItem value='timeApplied'>Time Applied</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
