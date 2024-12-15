"use client";

import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { mockCategories, mockHosts } from "@/data/rulesData";
import type { FilterOptions } from "@/types/rules";

interface BlocksFilterProps {
	filters: FilterOptions;
	onFiltersChange: (filters: FilterOptions) => void;
}

export function BlocksFilter({ filters, onFiltersChange }: BlocksFilterProps) {
	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<Label>Application Category</Label>
				{mockCategories.map((category) => (
					<div
						key={category}
						className='flex items-center space-x-2'>
						<Checkbox
							checked={filters.appCategory.includes(category)}
							onCheckedChange={(checked) => {
								onFiltersChange({
									...filters,
									appCategory: checked
										? [...filters.appCategory, category]
										: filters.appCategory.filter((c) => c !== category),
								});
							}}
						/>
						<Label>{category}</Label>
					</div>
				))}
			</div>

			<div className='space-y-2'>
				<Label>Hosts</Label>
				<Select
					value={filters.hosts[0] || ""}
					onValueChange={(value) =>
						onFiltersChange({ ...filters, hosts: [value] })
					}>
					<SelectTrigger>
						<SelectValue placeholder='Select host' />
					</SelectTrigger>
					<SelectContent>
						{mockHosts.map((host) => (
							<SelectItem
								key={host}
								value={host}>
								{host}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<Label>Internet Access</Label>
				<div className='flex items-center space-x-2'>
					<Checkbox
						checked={filters.internetAccess}
						onCheckedChange={(checked) =>
							onFiltersChange({ ...filters, internetAccess: !!checked })
						}
					/>
					<Label>Entire Internet</Label>
				</div>
			</div>

			<div className='space-y-2'>
				<Label>Time Range</Label>
				<div className='flex gap-2'>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className='w-[160px]'>
								<Calendar className='mr-2 h-4 w-4' />
								{filters.timeRange.start
									? filters.timeRange.start.toLocaleDateString()
									: "Pick start date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<CalendarComponent
								mode='single'
								selected={filters.timeRange.start || undefined}
								onSelect={(date) =>
									onFiltersChange({
										...filters,
										timeRange: { ...filters.timeRange, start: date },
									})
								}
							/>
						</PopoverContent>
					</Popover>

					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								className='w-[160px]'>
								<Calendar className='mr-2 h-4 w-4' />
								{filters.timeRange.end
									? filters.timeRange.end.toLocaleDateString()
									: "Pick end date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<CalendarComponent
								mode='single'
								selected={filters.timeRange.end || undefined}
								onSelect={(date) =>
									onFiltersChange({
										...filters,
										timeRange: { ...filters.timeRange, end: date },
									})
								}
							/>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
}
